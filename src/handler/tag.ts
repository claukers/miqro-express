import { NextCallback, NextHandler } from "./common";

export const TagResponseUUIDHandler = (): NextCallback => {
  return NextHandler(async (req, res, next) => {
    res.set('uuid', req.uuid);
    const requestUUID = req.header('request-uuid');
    if (requestUUID) {
      res.set('request-uuid', requestUUID);
    }
    next();
  });
};

