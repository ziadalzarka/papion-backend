export async function NestAwait<T>(obj): Promise<T> {
  if (obj.then) {
    return await obj;
  } else if (Array.isArray(obj)) {
    return await Promise.all(obj.map(field => NestAwait(field))) as any;
  } else if (Object.getPrototypeOf(obj) === Object.prototype) {
    const awaited = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      awaited[key] = await NestAwait(obj[key]);
    }
    return awaited as any;
  } else {
    return obj;
  }
}

export const ProcessGraphQLUploadArgs = NestAwait;
