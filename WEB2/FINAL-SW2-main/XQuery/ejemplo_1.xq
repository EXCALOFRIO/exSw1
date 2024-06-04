for $x at $i in
doc("ejemplo_1.xml")/bookstore/book/title
return <book>{$i}. {data($x)}</book>