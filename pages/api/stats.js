
export default async (req, res) => {
    console.log(req.body);
    console.log(req.protocol)     // "https"
    console.log(req.hostname)     // "example.com"
    console.log(req.path)         // "/creatures"
    console.log(req.originalUrl)  // "/creatures?filter=sharks"
    console.log(req.subdomains)   // "['ocean']"
   
    res.send('kookoo');   
})