#BIN := $(shell npm bin)
BIN := node_modules/less/bin
LESSC := $(BIN)/lessc

all: tm/tm.css

tm/tm.css: tm/*.less
	$(LESSC) tm/tm.less > $@
