#BIN := $(shell npm bin)
BIN := node_modules/less/bin
LESSC := $(BIN)/lessc

all: hitman.css

hitman.css: hitman.less elements/*.less
	$(LESSC) $< > $@
