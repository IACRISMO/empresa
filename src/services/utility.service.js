

function esNombreValido(nombre) {
  // Expresión regular para validar nombres
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

  // Lista de malas palabras
  const malasPalabras = ["mala1", "mala2", "mala3"];  // Sustituye con la lista real

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