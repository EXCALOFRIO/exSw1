setup:
	@ruby -v || (echo -e 'Es necesario tener ruby instalado\n Ver: "https://www.ruby-lang.org/es/documentation/installation/"' && exit) 
	@bundle -v || (echo -e 'Es necesario tener bundler instalado\n "gem install bundler"' && exit) 
	@bundle install

start:
	@bundle exec ruby lib/routes.rb

clean:
	@rm -rf ./.gems
