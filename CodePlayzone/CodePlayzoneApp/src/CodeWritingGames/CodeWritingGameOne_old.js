import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { GameEngine } from "react-native-game-engine";

const CodeWritingGameOne = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState([]);
  const [success, setSuccess] = useState(false);

  const runCode = () => {
    try {
      const lines = code.split("\n");
      const outputs = [];
      let variables = {};

      lines.forEach((line) => {
        if (line.startsWith("print")) {
          const match = line.match(/print\((.*)\)/);
          if (match) {
            const val = Function(...Object.keys(variables), `return ${match[1]}`)(...Object.values(variables));
            outputs.push(val.toString());
          }
        } else if (line.includes("=")) {
          const [key, value] = line.split("=").map(s => s.trim());
          if (key && value) {
            variables[key] = Function(...Object.keys(variables), `return ${value}`)(...Object.values(variables));
          }
        }
      });

      const helloExists = outputs.some(o => o.toLowerCase().includes("hello"));
      const calcPattern = /\b(\w)\s*\*\s*(\w)\s*\+\s*(\w)\b/;
      const expressionLine = lines.find(line => calcPattern.test(line));
      let expectedCalcOutput = null;

      if (expressionLine) {
        const match = expressionLine.match(calcPattern);
        if (match) {
          const [_, va, vb, vc] = match;
          expectedCalcOutput = variables[va] * variables[vb] + variables[vc];
        }
      }

      const calcExists = outputs.includes(expectedCalcOutput?.toString());

      if (helloExists && calcExists) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }

      setOutput(outputs);
    } catch (e) {
      setOutput(["Error in code execution"]);
      setSuccess(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#f0f4f8" }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>🧠 Task:</Text>
      <Text style={{ marginBottom: 16, fontSize: 16 }}>
        Print a message (like "Hello, everyone!"). Assign values to variables a, b, and c and print the result of a * b + c.
      </Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>💻 Code Editor:</Text>
      <TextInput
        style={{ padding: 12, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#ccc', minHeight: 160, fontSize: 16 }}
        multiline
        placeholder="Type your code here..."
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity
        onPress={runCode}
        style={{ backgroundColor: '#3b82f6', marginTop: 16, padding: 12, borderRadius: 16 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>▶️ Run Code</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 18, marginTop: 24, fontWeight: '600' }}>🗨️ Output:</Text>
      <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#ccc', minHeight: 60 }}>
        {output.map((line, i) => (
          <Text key={i} style={{ fontSize: 16 }}>{line}</Text>
        ))}
      </View>

      {success && (
        <View style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: '#c6f6d5',
          borderRadius: 16
        }}>
          <Text style={{ color: '#22543d', fontWeight: 'bold', textAlign: 'center' }}>
            🎉 Success! You completed the level!
          </Text>
        </View>
      )}

      <GameEngine
        style={{ height: 200, marginTop: 40 }}
        systems={[]}
        entities={{}}
      >
        {success && (
          <Text style={{ fontSize: 20, textAlign: 'center' }}>🐵 "{output.join(" ")}"</Text>
        )}
      </GameEngine>
    </ScrollView>
  );
};

export default CodeWritingGameOne;