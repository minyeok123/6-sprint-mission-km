export function uploadHandler() {
  return (req, res) => {
    const { filename } = req.file.filename;
    const path = `/file/${filename}`;
    res.send(path);
  };
}
