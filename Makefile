PREFIX = .
DIST_DIR = ${PREFIX}/dist

.PHONY: all clean run_build

all: clean run_build

clean:
	@@rm -rf ${DIST_DIR}

run_build:
	@@./build/build.sh