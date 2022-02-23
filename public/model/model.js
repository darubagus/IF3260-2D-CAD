class Model {
  constructor(type, vertex, color, translation, scale, rotation) {
    this.vertex = vertex;
    this.color = color;
    this.translation = translation;
    this.scale = scale;
    this.rotation = rotation;
    this.type = type;
  }

  saveToFile() {}
  draw(gl) {}
}
