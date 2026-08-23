


const adminMiddlwares = (request, response, next) => {

    const isUserAdmin = request.userAdmin;

    if(!isUserAdmin){
        return response.status(403).json({error: "Access denied"});
    }

   

    return next();

};

export default adminMiddlwares;