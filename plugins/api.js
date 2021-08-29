const axios = require('axios');
const config = require('./../config.json');
const authToken = config.kitpass;

exports.rawGet = async (endpoint) => {
    var request = await axios.get(`https://api.twotu.xyz/v3/${endpoint}/`);
    var final = request.data;
    return final;
    }

    exports.getHug = async () => {
        var request = await axios.get(`https://api.twotu.xyz/v3/hug`, {
    headers: {
        "Authorization" : `${authToken}`
      }
  });
        var final = request.data;
        return final.image;
        }
        
        exports.getKiss = async () => {
            var request = await axios.get(`https://api.twotu.xyz/v3/kiss/`, {
                headers: {
                    "Authorization" : `${authToken}`
                  }
              });
            var final = request.data;
            return final.image;
            }

            exports.getPoke = async () => {
                var request = await axios.get(`https://api.twotu.xyz/v3/poke/`, {
                    headers: {
                        "Authorization" : `${authToken}`
                      }
                  });
                var final = request.data;
                return final.image;
                }

                exports.getShrug = async () => {
                    var request = await axios.get(`https://api.twotu.xyz/v3/shrug/`, {
                        headers: {
                            "Authorization" : `${authToken}`
                          }
                      });
                    var final = request.data;
                    return final.image;
                    }

                    exports.getPat = async () => {
                        var request = await axios.get(`https://api.twotu.xyz/v3/pat/`, {
                            headers: {
                                "Authorization" : `${authToken}`
                              }
                          });
                        var final = request.data;
                        return final.image;
                        }

                        exports.getSlap = async () => {
                            var request = await axios.get(`https://api.twotu.xyz/v3/slap/`, {
                                headers: {
                                    "Authorization" : `${authToken}`
                                  }
                              });
                            var final = request.data;
                            return final.image;
                            }

                            exports.getSlap = async () => {
                                var request = await axios.get(`https://api.twotu.xyz/v3/loss/`, {
                                    headers: {
                                        "Authorization" : `${authToken}`
                                      }
                                  });
                                var final = request.data;
                                return final.image;
                                }

                            exports.get = async (endpoint) => {
                                var request = await axios.get(`https://api.twotu.xyz/v3/${endpoint}/`, {
                                    headers: {
                                        "Authorization" : `${authToken}`
                                      }
                                  });
                                var final = request.data;
                                return final.image;
                                }

                                exports.getV = async (endpoint) => {
                                    var request = await axios.get(`https://api.twotu.xyz/v3/${endpoint}/`, {
                                        headers: {
                                            "authorization" : `${authToken}`
                                          }
                                      });

                                    var final = request.data;

                                    console.log(final);
                                    
                                    return {
                                        url: final.image,
                                        name: final.name
                                    };
                                    }
