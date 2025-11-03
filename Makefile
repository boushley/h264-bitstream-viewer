dist/h264bitstream.js: \
	src/binding/binding.cpp \
	src/binding/reader.cpp \
	h264bitstream/.libs/libh264bitstream.so.0.0.0
	mkdir dist
	emcc \
		--bind \
		-O2  \
		-s ASSERTIONS=1 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s EXPORTED_RUNTIME_METHODS='["setValue", "ccall", "cwrap", "HEAPU8"]' \
		-s EXPORTED_FUNCTIONS='["_malloc", "_free"]' \
		-Ih264bitstream/ \
		-Isrc/wrapper/ \
		-o $@ \
		$^

h264bitstream/.libs/libh264bitstream.so.0.0.0:
	cd h264bitstream && \
		autoreconf -i && \
 		emconfigure ./configure && \
		emmake make CFLAGS=-DHAVE_SEI
