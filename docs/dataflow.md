# Dataflow

This document outlines the data flow within the application, from file selection to the display of parsed H264 bitstream data.

## 1. File Selection and Initial Processing

The process begins when the user selects an H264 bitstream file for analysis.

1.  **`H264BitstreamFile`**: An instance of this class is created with the selected `File` object. It acts as the central orchestrator for processing the file.

2.  **`FileReadStream`**: `H264BitstreamFile` creates a `FileReadStream` to read the file in chunks. This is done to handle large files efficiently without loading the entire file into memory at once. `FileReadStream` emits `data` events with chunks of the file.

## 2. Header Detection

3.  **`H264BitstreamHeaderStream`**: The `H264BitstreamFile` listens for `data` events from the `FileReadStream` and passes the chunks to an `H264BitstreamHeaderStream`. This class is responsible for identifying NAL (Network Abstraction Layer) unit boundaries within the bitstream.

4.  **`H264BitstreamParser`**: `H264BitstreamHeaderStream` uses the static methods of `H264BitstreamParser` to locate the start and end of NAL units. `H264BitstreamParser` implements the logic for finding start codes (`00 00 01` or `00 00 00 01`) that delineate NAL units.

5.  **Header Emission**: Once `H264BitstreamHeaderStream` identifies a complete NAL unit header, it emits a `data` event with an object containing information about the header, including its type, start offset, and end offset within the file.

6.  **`H264BitstreamFile` (Header Aggregation)**: The `H264BitstreamFile` listens for these `data` events and aggregates the headers into an internal `headers` array. It also emits `progress` events.

## 3. Detailed Parsing with WASM

When the user wants to inspect the contents of a specific NAL unit, the application uses the C++ WASM binding for detailed parsing.

7.  **`H264BitstreamBinding`**: An `H264BitstreamBinding` instance is created, which holds a reference to the `H264BitstreamFile`.

8.  **`getUnitData`**: To parse a specific header, the `read` method of `H264BitstreamBinding` is called. This method first calls `H264BitstreamFile.getUnitData(header)` to get the raw data for that NAL unit.

9.  **`FileChunkReader`**: `getUnitData` uses a `FileChunkReader` to read the specific byte range of the NAL unit from the file. This avoids re-reading the entire file.

10. **WASM Invocation**: `H264BitstreamBinding` then determines the appropriate C++ parsing function to call based on the NAL unit's `type`. It uses `invokeBindingMethod` to:
    *   Allocate memory in the WASM module's heap (`Module._malloc`).
    *   Copy the NAL unit data into the allocated memory.
    *   Call the corresponding C++ function (e.g., `readSPS`, `readPPS`) via `this.binding[methodName]`.
    *   Free the allocated memory (`Module._free`).

11. **Return Parsed Data**: The C++ function returns a structured object containing the parsed details of the NAL unit. This data is then returned up the chain.

## 4. Display

12. **UI Update**: The application's UI components receive the parsed data object and display it to the user in a structured and readable format.

## Class Interactions Summary

*   **`H264BitstreamFile`**: The central class. It uses `FileReadStream` and `H264BitstreamHeaderStream` to find headers. It provides the `getUnitData` method for `H264BitstreamBinding` to get NAL unit data.
*   **`FileReadStream`**: Reads the file in chunks.
*   **`H264BitstreamHeaderStream`**: Consumes chunks from `FileReadStream` and uses `H264BitstreamParser` to find NAL unit headers.
*   **`H264BitstreamParser`**: A utility class with static methods for low-level bitstream parsing (finding start codes).
*   **`FileChunkReader`**: Used by `H264BitstreamFile` to read specific parts of the file on demand.
*   **`H264BitstreamBinding`**: The bridge to the C++ WASM module. It takes a header, gets the data from `H264BitstreamFile`, and calls the appropriate WASM function to parse it.
*   **`EventEmitter`**: A base class used by several other classes to enable event-based communication (e.g., `data`, `end`, `progress` events).
