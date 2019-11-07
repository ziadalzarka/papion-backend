import { Schema } from 'mongoose';

export function injectPopulationOnProjection(collectionSchema: Schema, populateFields: string[]) {
  function inject() {
    // if something is selected
    if ((this as any)._fields && Object.keys((this as any)._fields).length > 0) {
      populateFields.map(populateField => {
        if ((this as any)._fields[populateField]) {
          this.populate(populateField);
        }
      });
    } else {
      populateFields.map(populateField => this.populate(populateField));
    }
  }
  collectionSchema.pre('find', inject);
  collectionSchema.pre('findOne', inject);
  collectionSchema.pre('findOneAndUpdate', inject);
}
