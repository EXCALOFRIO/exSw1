require 'nokogiri'

xsd = File.read(ARGV[0])
xml = File.read(ARGV[1])

schema = Nokogiri::XML::Schema(xsd)
doc = Nokogiri::XML(xml)

errors = schema.validate(doc)

if errors.empty?
  puts 'Valid'
else
  puts 'Not valid'
  puts 'Errors'
  errors.each { |e| puts e }
end
