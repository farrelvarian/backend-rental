const redis = require("redis");
const client = redis.createClient(6379);
const helpers = require("../helpers/helpers");

const hitCacheAllProduct = (req, res, next) => {
    const numPerPage = parseInt(req.query.npp) || 15;
    const page = parseInt(req.query.page) || 1;
    const field = req.query.field || "name";
    const sort = req.query.sort || "ASC";
    const paramSearch = req.query.search || "";
    client.get(
        `products/${numPerPage}/${page}/${sort}/${paramSearch}`,
        function(err, data) {
            // reply is null when the key is missing
            if (data !== null) {
                const result = JSON.parse(data);
                return helpers.response(res, "Success get data", result, 200);
            } else {
                next();
            }
        }
    );
};
const hitCacheProductId = (req, res, next) => {
    const id = req.params.id;
    client.get(`product/${id}`, function(err, data) {
        // reply is null when the key is missing
        if (data !== null) {
            const result = JSON.parse(data);
            console.log("data cache di hit");
            return helpers.response(res, "Success get data", result, 200);
        } else {
            next();
        }
    });
};
const hitCacheProductCategory = (req, res, next) => {
    const category_id = req.params.category_id;
    const field = req.query.field || "name";
    const sort = req.query.sort || "ASC";
    client.get(`products/${category_id}/${field}/${sort}`, function(err, data) {
        // reply is null when the key is missing
        if (data !== null) {
            const result = JSON.parse(data);
            console.log("data cache di hit");
            return helpers.response(res, "Success get data", result, 200);
        } else {
            next();
        }
    });
};
const clearRedisProduct = (req, res, next) => {
   client.flushall("ASYNC", next());

};
module.exports = {
    hitCacheAllProduct,
    hitCacheProductId,
    hitCacheProductCategory,
    clearRedisProduct,
};