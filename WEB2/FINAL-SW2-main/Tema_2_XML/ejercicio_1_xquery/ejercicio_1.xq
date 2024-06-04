for $book in doc("ejercicio.xml")//book
order by xs:decimal($book/price) ascending
return $book/title