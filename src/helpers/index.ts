const isOwner = (userId: number, propertyUserId: number): boolean => {
  return userId === propertyUserId;
};

export { isOwner };
