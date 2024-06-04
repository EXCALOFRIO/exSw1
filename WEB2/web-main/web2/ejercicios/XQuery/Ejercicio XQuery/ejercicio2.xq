for $x at $i in doc("../ejercicio1.xml")/bib/book
where $x/author = "Abiteboul"
return $x     

//count(doc("../ejercicio1.xml")/bib/book[author = "Abiteboul"])