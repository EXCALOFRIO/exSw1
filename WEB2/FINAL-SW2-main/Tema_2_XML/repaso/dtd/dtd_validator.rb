require 'nokogiri'

begin
  dtd = File.read(ARGV[0])
  xml = File.read(ARGV[1])
  xml.gsub!(/<\?xml.*\?>/, '')
  document = xml.prepend(dtd)

  options = Nokogiri::XML::ParseOptions::DTDVALID
  Nokogiri::XML::Document.parse(document, nil, nil, options)
  puts 'Valid'
rescue Exception => e
  puts 'Not valid'
  puts e
end
