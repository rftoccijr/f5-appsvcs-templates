'use strict';

class ResourceCache {
    constructor(asyncFetch) {
        // used for caching AS3 TemplateEngine objects
        this.cached = {};
        this.cache_limit = 100;
        this.asyncFetch = asyncFetch;
        return this;
    }

    fetch(key) {
        return (() => {
            if (!this.cached[key]) {
                return this.asyncFetch(key)
                    .then((resource) => {
                        this.cached[key] = resource;
                        const allKeys = Object.keys(this.cached);
                        const oldestKey = allKeys.shift();
                        if (allKeys.length > this.cache_limit) delete this.cached[oldestKey];
                        return resource;
                    });
            }
            return Promise.resolve(this.cached[key]);
        })();
    }

    invalidate() {
        this.cached = {};
    }
}

module.exports = {
    ResourceCache
};
