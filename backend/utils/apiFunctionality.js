

class APIFunctionality {
    constructor(query, queryStr) {
        this.query = query,
            this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                $or: [
                    {
                        name: {
                            $regex: this.queryStr.keyword,
                            $options: "i"
                        }
                    },
                    {
                        category: {
                            $regex: this.queryStr.keyword,
                            $options: "i"
                        }
                    },
                    {
                        description: {
                            $regex: this.queryStr.keyword,
                            $options: "i"
                        }
                    }
                ]
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove non-filter fields
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Apply case-insensitive regex for specific fields
        const caseInsensitiveFields = ["category", "name", "description"];
        for (const key of caseInsensitiveFields) {
            if (queryCopy[key]) {
                queryCopy[key] = {
                    $regex: queryCopy[key],
                    $options: "i",
                };
            }
        }

        // Apply final query
        this.query = this.query.find(queryCopy);
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        
        // Apply pagination
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }




}


export default APIFunctionality;