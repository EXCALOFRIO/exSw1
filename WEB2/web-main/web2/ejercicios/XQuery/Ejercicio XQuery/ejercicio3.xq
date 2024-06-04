xquery version "1.0";
<authors>
{
for $items at $i in doc("../ejercicio1.xml")/bib
let $authors := distinct-values($items//author) 
  for $author in $authors
    return
    <author> 
      <name>{ $author }</name>
      <count>{count(doc("../ejercicio1.xml")/bib/book[author = $author])}</count>
    </author>     
}
</authors>



