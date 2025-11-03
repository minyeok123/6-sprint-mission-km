export function asyncDeleteHandler(model) {
  return async (req, res) => {
    const { id } = req.params;
    await model.delete({
      where: { id },
    });
    res.sendStatus(204);
  };
}
