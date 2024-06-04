let $abiteboulBooks := 
  for $book in doc("ejercicio.xml")//book
  where $book/author = "Abiteboul"
  return $book
return count($abiteboulBooks)