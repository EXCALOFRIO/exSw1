require 'sinatra'
require 'nokogiri'
require 'pathname'

SCHEMAS_PATH = Pathname.new(__dir__).join('..', 'schemas')

set :port, 5555

helpers do
  def valid?(xml, dtd)
    # Build XML string appending DTD on top
    xml_to_validate = xml.prepend(dtd)

    # Parse XML forcing errors if not valid
    options = Nokogiri::XML::ParseOptions::DTDVALID
    Nokogiri::XML::Document.parse(xml_to_validate, nil, nil, options)

    # Return true if valid, false otherwise
    true
  rescue Nokogiri::XML::SyntaxError
    false
  end
end

post '/resource' do
  path = SCHEMAS_PATH.join('resource.dtd').to_path
  dtd = File.read(path)
  xml = request.body.read

  status valid?(xml, dtd) ? 200 : 400
end

post '/resourcePut' do
  path = SCHEMAS_PATH.join('resourcePut.dtd').to_path
  dtd = File.read(path)
  xml = request.body.read

  status valid?(xml, dtd) ? 200 : 400
end

post '/assetSchema' do
  path = SCHEMAS_PATH.join('assetSchema.dtd').to_path
  dtd = File.read(path)
  xml = request.body.read

  status valid?(xml, dtd) ? 200 : 400
end

post '/assetPutSchema' do
  path = SCHEMAS_PATH.join('assetPutSchema.dtd').to_path
  dtd = File.read(path)
  xml = request.body.read

  status valid?(xml, dtd) ? 200 : 400
end
