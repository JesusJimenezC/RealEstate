import type { Request, Response } from "express";
import { User } from "../models";
import {
  check,
  validationResult,
  Result,
  type ValidationError,
} from "express-validator";
import { generateId } from "../helpers/token.ts";
import { emailForgotPassword, registerEmail } from "../helpers/emails.ts";

const loginView = (req: Request, res: Response): void => {
  res.render("auth/login", {
    page: "Sign in",
    csrfToken: req.csrfToken(),
  });
};

const loginAccount = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validation
  await check("email")
    .isEmail()
    .withMessage("Email needs to be valid.")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password is mandatory.")
    .run(req);

  const result: Result<ValidationError> = validationResult(req);

  if (!result.isEmpty()) {
    const errors: ValidationError[] = result.array();
    return res.render("auth/login", {
      page: "Sign in",
      errors,
      csrfToken: req.csrfToken(),
      user: {
        email,
      },
    });
  }

  const user: User | null = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.render("auth/login", {
      page: "Sign in",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "User does not exist.",
        },
      ],
      user: {
        email,
      },
    });
  }

  if (!user.verified) {
    return res.render("auth/login", {
      page: "Sign in",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "User is not verified. Check your email for the confirmation link.",
        },
      ],
      user: {
        email,
      },
    });
  }

  if (!(await user.validPassword(password))) {
    return res.render("auth/login", {
      page: "Sign in",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "User or password is incorrect.",
        },
      ],
      user: {
        email,
      },
    });
  }

  const token: string = await user.generateJWT();

  return res
    .cookie("_token", token, {
      httpOnly: true,
    })
    .redirect("/my-properties");
};

const formView = (req: Request, res: Response): void => {
  res.render("auth/register", {
    page: "Create account",
    csrfToken: req.csrfToken(),
  });
};

const registerAccount = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  // Validation
  await check("name").notEmpty().withMessage("Name is mandatory.").run(req);
  await check("email")
    .isEmail()
    .withMessage("Email needs to be valid.")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .run(req);
  await check("rep_password")
    .equals(password)
    .withMessage("Both passwords must be the same.")
    .run(req);

  const result: Result<ValidationError> = validationResult(req);

  if (!result.isEmpty()) {
    const errors: ValidationError[] = result.array();
    return res.render("auth/register", {
      page: "Create account",
      errors,
      csrfToken: req.csrfToken(),
      user: {
        name,
        email,
      },
    });
  }

  // Verify user does not exist
  const user: User | null = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    return res.render("auth/register", {
      page: "Create account",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "User already exists.",
        },
      ],
      user: {
        name,
        email,
      },
    });
  }

  User.create({
    name,
    email,
    password,
    token: generateId(),
  })
    .then(({ name, email, token }): void => {
      registerEmail(name, email, token!);
    })
    .catch((error): void => {
      console.error(error);
    });

  res.render("templates/message", {
    page: "Create account",
    message:
      "We have sent you a confirmation link, check your email and click on it to activate your account.",
  });
};

const verifyAccountView = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.params;

  const user: User | null = await User.findOne({
    where: {
      token,
    },
  });

  if (!user) {
    return res.render("templates/verify-account", {
      page: "Verify account",
      message:
        "The token is invalid or has been used to confirm another account previously.",
      error: true,
    });
  }

  user.verified = true;
  user.token = null;
  await user.save();

  res.render("templates/verify-account", {
    page: "Verify account",
    message: "Account verified, you can now sign in.",
    error: false,
  });
};

const forgotPasswordView = (req: Request, res: Response): void => {
  res.render("auth/forgot-password", {
    page: "Recover your access",
    csrfToken: req.csrfToken(),
  });
};

const forgotPasswordAccount = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Validation
  await check("email")
    .isEmail()
    .withMessage("Email needs to be valid.")
    .run(req);

  const result: Result<ValidationError> = validationResult(req);

  if (!result.isEmpty()) {
    const errors: ValidationError[] = result.array();
    return res.render("auth/forgot-password", {
      page: "Regain access to RealEstate",
      errors,
      csrfToken: req.csrfToken(),
    });
  }

  const { email } = req.body;

  const user: User | null = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    user.token = generateId();
    await user.save();

    // Send email
    await emailForgotPassword(user.name, user.email, user.token!);
  }

  res.render("templates/message", {
    page: "Regain access",
    message:
      "If the email is registered, we have sent you a link to reset your password.",
  });
};

const resetPasswordView = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.params;

  const user: User | null = await User.findOne({
    where: {
      token,
    },
  });

  if (!user) {
    return res.render("templates/verify-account", {
      page: "Reset password",
      message:
        "The link is not valid or has been used to reset your password previously.",
      error: true,
    });
  }

  res.render("auth/reset-password", {
    page: "Reset password",
    csrfToken: req.csrfToken(),
    token,
  });
};

const resetPasswordAccount = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.params;
  const { password } = req.body;

  // Validation
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .run(req);
  await check("rep_password")
    .equals(password)
    .withMessage("Both passwords must be the same.")
    .run(req);

  const result: Result<ValidationError> = validationResult(req);

  if (!result.isEmpty()) {
    const errors: ValidationError[] = result.array();
    return res.render("auth/reset-password", {
      page: "Reset password",
      errors,
      csrfToken: req.csrfToken(),
      token,
    });
  }

  const user: User | null = await User.findOne({
    where: {
      token,
    },
  });

  if (!user) {
    return res.render("templates/verify-account", {
      page: "Verify account",
      message:
        "The token is invalid or has been used to confirm another account previously.",
      error: true,
    });
  }

  user.password = await user.hashPassword(password);
  user.token = null;
  await user.save();

  res.render("templates/message", {
    page: "Reset password",
    message: "Password updated successfully.",
  });
};

export {
  loginView,
  formView,
  forgotPasswordView,
  registerAccount,
  verifyAccountView,
  forgotPasswordAccount,
  resetPasswordView,
  resetPasswordAccount,
  loginAccount,
};
