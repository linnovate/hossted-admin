
export default async (req, res) => {
    console.log(req);
    console.log("---");
    console.log(res)
    res.send(JSON.stringify(req, null, 2))   
}