declare namespace Express {
  export interface Request {
    user?: import("src/models").User;
    csrfToken: () => string;
  }
}
