import { Schema } from 'mongoose';

export function ensureProjection(schema: Schema, projection) {
  function func(next) {
    if ((this as any)._fields && Object.keys((this as any)._fields).length > 0) {
      this.select(projection);
    }
    next();
  }
  schema.pre('find', func);
  schema.pre('findOne', func);
  schema.pre('findOneAndUpdate', func);
  schema.pre('findOneAndRemove', func);
}
