const x = 11;
try {
    x = 12;
  } catch (e) {
    console.error("Can't change the value of a constant");
  }