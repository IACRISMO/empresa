

function esNombreValido(nombre) {
  // Expresión regular para validar nombres
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

  // Lista de malas palabras
  const malasPalabras = ["huachafo", "pata", "chamba", "cholo", "causa", "jato",
   "floro", "fercho", "cacharro", "zampón", "chela", "pucha", "cachanga",
    "chibolo", "achorado", "huevón", "huasca", "joroba", "pichanga", "calato", 
    "trome", "cañazo", "jarana", "caleta", "tombo", "manya", "fugaz", "mostro",
    "caer", "jamear", "pisco", "mostasero", "yara", "chacra", "sapear", "lorna",
    "plop", "yanqui", "combi", "bamba", "palteado", "jorobar", "paltas", "flaca",
    "churre", "putear", "conchudo", "jalador", "wawita", "jirón", "broder", "fiesta",
    "chongo", "huaracazo", "charapa", "pendejo", "cachina", "calabaza", "pegalón",
    "paiche", "bacán", "cabro", "cancha", "carajo", "choro", "pana", "guachimán", 
    "yuca", "melcocha", "pitri mitri", "fulano", "huaco", "zapatilla", "mote", 
    "huachafería", "jeropa", "tocayo", "tarumba", "jachudo", "guachimanear", 
    "tambo", "changa", "huaralino", "chifar", "pituco", "chancaca", "salud", 
    "zafacasa", "mañas", "fierro", "huaranga", "zaraza", "pato", "mierda",
    "zorra", "paletear", "chato", "charapa"];  // Sustituye con la lista real

  // Primero, validamos que el nombre cumpla con la expresión regular
  if (!regex.test(nombre)) {
      return false;
  }
  
  // Luego, verificamos que no contenga malas palabras
  for (let palabra of malasPalabras) {
      if (nombre.toLowerCase().includes(palabra.toLowerCase())) {
          return false;
      }
  }
  
  return true;
};

// Expresión regular para validar un número de 8 dígitos
function esDniValido(numero) {
    const regex = /^\d{8}$/;
    return regex.test(numero);
};

module.exports = {
    esNombreValido,
    esDniValido
};