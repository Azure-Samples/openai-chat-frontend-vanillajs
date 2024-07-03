export function handleStream(stream) {
    const reader = stream.getReader();
    let charsReceived = 0;
  
    // read() returns a promise that resolves
    // when a value has been received
    reader.read().then(function processText({ done, value }) {
      // Result objects contain two properties:
      // done  - true if the stream has already given you all its data.
      // value - some data. Always undefined when done is true.
      if (done) {
        console.log("Stream complete");
        para.textContent = value;
        return;
      }
  
      // value for fetch streams is a Uint8Array
      charsReceived += value.length;
      const chunk = value;
      listItem.textContent = `Received ${charsReceived} characters so far. Current chunk = ${chunk}`;
      list2.appendChild(listItem);
  
      result += chunk;
  
      // Read some more, and call this function again
      return reader.read().then(processText);
    });
  }
  