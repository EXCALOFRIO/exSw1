<authors>
  {
    for $author in distinct-values(doc("ejercicio.xml")//author)
    return
    <author>
      <name>{ $author }</name>
      <count>
      {
        let $books :=
          for $book in doc("ejercicio.xml")//book
          where $book/author = $author
          return $book
         return count($books)
      }
      </count>
    </author>
  }
</authors>