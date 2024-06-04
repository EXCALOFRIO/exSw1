for $x in doc("../ejercicio1.xml")/bib/book
order by xs:decimal($x/price) descending
return $x/title