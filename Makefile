BIN := $(shell npm bin)
LESSC := $(BIN)/lessc

tm/tm.css: tm/tm.less
	$(LESSC) $^ > $@
