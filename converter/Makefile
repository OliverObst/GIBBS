all: rcg2replay

rcg2replay: rcg2replay.cpp
	g++  -lrcsc_gz -lrcsc_rcg -lz -lm  -o rcg2replay rcg2replay.cpp 

clean:
	rm rcg2replay
	rm *~
