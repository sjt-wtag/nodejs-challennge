const pendingRequests = new Map();

export async function blockingGet(key) {
  return new Promise((resolve) => {
    if (pendingRequests.has(key)) pendingRequests.get(key).push(resolve);
    else pendingRequests.set(key, [resolve]);

    setTimeout(() => {
      if (pendingRequests.has(key)) {
        const index = pendingRequests.get(key).indexOf(resolve); //indexOf() returns first index of matched key data

        if (index !== -1) {
          pendingRequests.get(key).splice(index, 1);
        }
        resolve(null);
      }
    }, 40000);
  });
}

export async function push(key, data) {
  if (pendingRequests.has(key)) {
    const resolveArray = pendingRequests.get(key);
    const resolve = resolveArray.shift(); //shift() removes & returns first resolve

    if (resolveArray.length === 0) pendingRequests.delete(key);
    resolve(data);
  }
}