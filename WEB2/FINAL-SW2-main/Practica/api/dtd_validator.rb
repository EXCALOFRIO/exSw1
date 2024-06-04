require 'nokogiri'

XML_PATH = 'ejercicio_1_dtd.xml'

xml = File.read(XML_PATH)
options = Nokogiri::XML::ParseOptions::DTDVALID
doc = Nokogiri::XML::Document.parse(xml, nil, nil, options)
puts doc
