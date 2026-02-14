import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CodeMemory database with web development content...\n");

  // ============================================================================
  // CONCEPT 1: JavaScript Promises
  // ============================================================================
  console.log("📚 Creating concept: JavaScript Promises");
  const promisesConcept = await prisma.concept.create({
    data: {
      name: "JavaScript Promises",
      category: "Async Programming",
      language: "JavaScript",
      difficulty: 2,
      description:
        "Master asynchronous JavaScript with Promises. Understand promise states, chaining, error handling, and common patterns like Promise.all() and Promise.race().",
    },
  });

  // Flashcards for JavaScript Promises
  const promisesFlashcards = [
    // Syntax Recall (2 cards)
    {
      conceptId: promisesConcept.id,
      type: "syntax",
      front: "How do you create a Promise that resolves with a value after 1 second?",
      back: "new Promise(resolve => setTimeout(() => resolve(value), 1000))",
      codeExample: `const delayedPromise = new Promise(resolve => {
  setTimeout(() => resolve("Done!"), 1000);
});`,
    },
    {
      conceptId: promisesConcept.id,
      type: "syntax",
      front: "How do you handle errors in a Promise chain?",
      back: "Use .catch() at the end of the chain, or try/catch with async/await",
      codeExample: `// Method 1: .catch()
promise
  .then(result => processResult(result))
  .catch(error => console.error(error));

// Method 2: async/await
try {
  const result = await promise;
  processResult(result);
} catch (error) {
  console.error(error);
}`,
    },
    // Concept Explanation (2 cards)
    {
      conceptId: promisesConcept.id,
      type: "concept",
      front: "What are the three states of a Promise?",
      back: "Pending (initial state), Fulfilled (operation completed successfully), Rejected (operation failed)",
      codeExample: `const promise = new Promise((resolve, reject) => {
  // Pending state initially
  if (success) resolve(value);  // → Fulfilled
  else reject(error);           // → Rejected
});`,
    },
    {
      conceptId: promisesConcept.id,
      type: "concept",
      front: "What's the difference between Promise.all() and Promise.race()?",
      back: "Promise.all() waits for ALL promises to resolve (or ANY to reject). Promise.race() resolves/rejects as soon as the FIRST promise settles.",
      codeExample: `// Promise.all - waits for all
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);

// Promise.race - uses first to complete
const result = await Promise.race([
  fetchWithTimeout(),
  timeout(5000)
]);`,
    },
    // Code Prediction (2 cards)
    {
      conceptId: promisesConcept.id,
      type: "prediction",
      front: "What does this code output?\n\nPromise.resolve(1)\n  .then(x => x + 1)\n  .then(x => x * 2)\n  .then(console.log)",
      back: "4 (because 1 + 1 = 2, then 2 * 2 = 4)",
      codeExample: null,
    },
    {
      conceptId: promisesConcept.id,
      type: "prediction",
      front: "What does this code output?\n\nconsole.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);",
      back: "1, 3, 2 (Promise callbacks are queued in the microtask queue, executed after current code)",
      codeExample: null,
    },
    // Bug Identification (2 cards)
    {
      conceptId: promisesConcept.id,
      type: "bug",
      front: "What's wrong with this code?\n\nasync function getData() {\n  return fetch('/api/data');\n}\n\nconst data = await getData();\nconsole.log(data.json());",
      back: "Two bugs: 1) await getData() returns a Response object, not parsed data. 2) data.json() returns a Promise that needs to be awaited. Should be: const response = await getData(); const data = await response.json();",
      codeExample: `// Correct version:
async function getData() {
  const response = await fetch('/api/data');
  return response.json();
}

const data = await getData();
console.log(data);`,
    },
    {
      conceptId: promisesConcept.id,
      type: "bug",
      front: "What's wrong with this error handling?\n\nPromise.resolve()\n  .then(() => { throw new Error('Fail'); })\n  .then(() => console.log('Success'));\n  .catch(err => console.error(err));",
      back: "Syntax error: extra semicolon before .catch(). Should be chained without the semicolon after 'Success')",
      codeExample: `// Correct version:
Promise.resolve()
  .then(() => { throw new Error('Fail'); })
  .then(() => console.log('Success'))
  .catch(err => console.error(err));`,
    },
    // Use Case (2 cards)
    {
      conceptId: promisesConcept.id,
      type: "use_case",
      front: "When should you use Promise.allSettled() instead of Promise.all()?",
      back: "Use Promise.allSettled() when you want ALL promises to complete regardless of success/failure. Promise.all() rejects immediately if ANY promise fails, while allSettled() waits for all and returns status for each.",
      codeExample: `// Promise.allSettled - handles partial failures
const results = await Promise.allSettled([
  fetch('/api/users'),    // might fail
  fetch('/api/posts'),    // might fail
  fetch('/api/comments')  // might fail
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Success:', result.value);
  } else {
    console.log('Failed:', result.reason);
  }
});`,
    },
    {
      conceptId: promisesConcept.id,
      type: "use_case",
      front: "When would you use Promise.race() in real applications?",
      back: "Common use cases: implementing timeouts, using fastest data source, cancelling slow requests, implementing retry logic with delays",
      codeExample: `// Timeout pattern
async function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}`,
    },
  ];

  await prisma.flashcard.createMany({ data: promisesFlashcards });
  console.log(`  ✓ Created ${promisesFlashcards.length} flashcards`);

  // Challenges for JavaScript Promises
  const promisesChallenges = [
    {
      conceptId: promisesConcept.id,
      title: "Create a Delay Function",
      description:
        "Create a function called 'delay' that returns a Promise which resolves after a specified number of milliseconds.",
      language: "javascript",
      stage: 1,
      difficulty: "beginner",
      starterCode: `function delay(ms) {
  // Your code here
}

// Test: should wait 100ms then log "Done"
delay(100).then(() => console.log("Done"));`,
      testCases: [
        {
          input: "50",
          expected: "resolves after ~50ms",
          description: "Should resolve after 50ms",
        },
        {
          input: "0",
          expected: "resolves immediately",
          description: "Should handle 0ms delay",
        },
      ],
      hints: JSON.stringify([
        "Use new Promise() to create a Promise",
        "Use setTimeout() inside the Promise",
        "Call resolve() after the delay",
      ]),
    },
    {
      conceptId: promisesConcept.id,
      title: "Fetch and Parse User Data",
      description:
        "Complete the async function to fetch user data from an API and return just the username field.",
      language: "javascript",
      stage: 2,
      difficulty: "beginner",
      starterCode: `async function getUsername(userId) {
  const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
  // TODO: Complete this function to return just the username
}`,
      testCases: [
        {
          input: "1",
          expected: "Bret",
          description: "Should return username for user 1",
        },
      ],
      hints: JSON.stringify([
        "Parse the response with .json()",
        "Remember to await the .json() call",
        "Return response.username",
      ]),
    },
    {
      conceptId: promisesConcept.id,
      title: "Fix Sequential API Calls",
      description:
        "This function makes API calls sequentially (slow!). Fix it to run in parallel using Promise.all().",
      language: "javascript",
      stage: 3,
      difficulty: "intermediate",
      starterCode: `async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();
  return { users, posts, comments };
}

// Mock API functions
function fetchUsers() { return Promise.resolve(['Alice', 'Bob']); }
function fetchPosts() { return Promise.resolve(['Post 1', 'Post 2']); }
function fetchComments() { return Promise.resolve(['Comment 1']); }`,
      testCases: [
        {
          input: "N/A",
          expected: "{ users, posts, comments }",
          description: "Should fetch all data in parallel",
        },
      ],
      hints: JSON.stringify([
        "Use Promise.all() to run promises in parallel",
        "Pass an array of promises to Promise.all()",
        "Destructure the result array",
      ]),
    },
    {
      conceptId: promisesConcept.id,
      title: "Implement Retry Logic",
      description:
        "Create a retry function that attempts an async operation up to maxAttempts times before giving up.",
      language: "javascript",
      stage: 4,
      difficulty: "advanced",
      starterCode: `async function retry(fn, maxAttempts = 3) {
  // Your implementation here
}

// Test function that fails twice then succeeds
let attempts = 0;
async function flakyFunction() {
  attempts++;
  if (attempts < 3) throw new Error('Failed');
  return 'Success';
}`,
      testCases: [
        {
          input: "flakyFunction, 3",
          expected: "'Success'",
          description: "Should succeed after 2 failures",
        },
        {
          input: "alwaysFails, 3",
          expected: "throws Error",
          description: "Should throw after max attempts",
        },
      ],
      hints: JSON.stringify([
        "Use a for loop to attempt multiple times",
        "Try the function, catch errors, continue loop",
        "Throw the last error if all attempts fail",
      ]),
    },
    {
      conceptId: promisesConcept.id,
      title: "Build Promise.all() from Scratch",
      description:
        "Implement your own version of Promise.all() that takes an array of promises and returns a promise that resolves with an array of results.",
      language: "javascript",
      stage: 5,
      difficulty: "advanced",
      starterCode: `function promiseAll(promises) {
  // Your implementation here
}

// Test
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // Should output: [1, 2, 3]`,
      testCases: [
        {
          input: "[Promise.resolve(1), Promise.resolve(2)]",
          expected: "[1, 2]",
          description: "Should resolve all promises",
        },
        {
          input: "[Promise.resolve(1), Promise.reject('error')]",
          expected: "rejects with 'error'",
          description: "Should reject if any promise rejects",
        },
      ],
      hints: JSON.stringify([
        "Return a new Promise",
        "Keep track of resolved count and results",
        "Resolve the outer promise when all are done",
        "Reject immediately if any promise rejects",
      ]),
    },
  ];

  await prisma.challenge.createMany({ data: promisesChallenges });
  console.log(`  ✓ Created ${promisesChallenges.length} challenges\n`);

  // ============================================================================
  // CONCEPT 2: React Hooks
  // ============================================================================
  console.log("📚 Creating concept: React Hooks");
  const hooksConcept = await prisma.concept.create({
    data: {
      name: "React Hooks",
      category: "Frontend Framework",
      language: "JavaScript",
      difficulty: 2,
      description:
        "Master React Hooks including useState, useEffect, useCallback, useMemo, useRef, and custom hooks. Understand when and how to use each hook effectively.",
    },
  });

  const hooksFlashcards = [
    {
      conceptId: hooksConcept.id,
      type: "syntax",
      front: "How do you declare state in a functional component?",
      back: "const [state, setState] = useState(initialValue)",
      codeExample: `const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: 'Alice' });`,
    },
    {
      conceptId: hooksConcept.id,
      type: "syntax",
      front: "How do you run an effect only once when component mounts?",
      back: "Pass an empty dependency array: useEffect(() => { ... }, [])",
      codeExample: `useEffect(() => {
  // This runs only once on mount
  fetchData();
}, []);`,
    },
    {
      conceptId: hooksConcept.id,
      type: "concept",
      front: "What's the difference between useCallback and useMemo?",
      back: "useCallback memoizes a FUNCTION. useMemo memoizes a VALUE (result of a function).",
      codeExample: `// useCallback - returns memoized function
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useMemo - returns memoized value
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);`,
    },
    {
      conceptId: hooksConcept.id,
      type: "concept",
      front: "Why can't you call hooks inside conditions or loops?",
      back: "Hooks rely on call order to maintain state between renders. Conditional calls would break this order, causing state to get mixed up.",
      codeExample: `// ❌ Wrong
if (condition) {
  const [state, setState] = useState(0);
}

// ✅ Correct
const [state, setState] = useState(0);
if (condition) {
  setState(newValue);
}`,
    },
    {
      conceptId: hooksConcept.id,
      type: "prediction",
      front: "How many times does this component render?\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  setCount(count + 1);\n  return <div>{count}</div>;\n}",
      back: "Infinite loop! Setting state directly in render causes re-render, which sets state again, causing infinite renders.",
      codeExample: null,
    },
    {
      conceptId: hooksConcept.id,
      type: "prediction",
      front: "What gets logged when button is clicked?\n\nconst [count, setCount] = useState(0);\nconst handleClick = () => {\n  setCount(count + 1);\n  setCount(count + 1);\n  console.log(count);\n}",
      back: "Logs the old count (0). State updates are batched and applied after the function. count is still the old value during execution.",
      codeExample: null,
    },
    {
      conceptId: hooksConcept.id,
      type: "bug",
      front: "What's wrong with this effect?\n\nuseEffect(() => {\n  const timer = setInterval(() => {\n    console.log(count);\n  }, 1000);\n}, [count]);",
      back: "Memory leak! The interval is never cleared. Should return a cleanup function: return () => clearInterval(timer);",
      codeExample: `// Correct version:
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count);
  }, 1000);
  return () => clearInterval(timer);
}, [count]);`,
    },
    {
      conceptId: hooksConcept.id,
      type: "bug",
      front: "What's the problem with this event listener?\n\nuseEffect(() => {\n  window.addEventListener('scroll', handleScroll);\n}, []);",
      back: "No cleanup! The listener persists after unmount, causing memory leaks. Should return () => window.removeEventListener('scroll', handleScroll);",
      codeExample: `// Correct version:
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);`,
    },
    {
      conceptId: hooksConcept.id,
      type: "use_case",
      front: "When should you use useRef instead of useState?",
      back: "Use useRef when you need a mutable value that persists across renders but DOESN'T trigger re-renders when changed. Common uses: DOM refs, storing intervals/timeouts, keeping previous values.",
      codeExample: `// Tracking previous value without re-renders
const prevCount = useRef();
useEffect(() => {
  prevCount.current = count;
}, [count]);

// DOM reference
const inputRef = useRef();
const focusInput = () => inputRef.current.focus();`,
    },
    {
      conceptId: hooksConcept.id,
      type: "use_case",
      front: "When should you create a custom hook?",
      back: "When you have stateful logic that's reused across multiple components. Custom hooks let you extract and share component logic without changing component hierarchy.",
      codeExample: `// Custom hook for API fetching
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading };
}`,
    },
  ];

  await prisma.flashcard.createMany({ data: hooksFlashcards });
  console.log(`  ✓ Created ${hooksFlashcards.length} flashcards`);

  const hooksChallenges = [
    {
      conceptId: hooksConcept.id,
      title: "Simple Counter with useState",
      description: "Create a counter component that increments when a button is clicked.",
      language: "javascript",
      stage: 1,
      difficulty: "beginner",
      starterCode: `function Counter() {
  // Add useState here
  
  return (
    <div>
      <p>Count: {/* show count */}</p>
      <button onClick={/* increment */}>+</button>
    </div>
  );
}`,
      testCases: [
        { input: "click", expected: "count increases by 1", description: "Should increment on click" },
      ],
      hints: JSON.stringify(["Use useState(0) to initialize", "Call setCount in onClick handler"]),
    },
    {
      conceptId: hooksConcept.id,
      title: "Fetch Data on Mount",
      description: "Complete this component to fetch data when it mounts.",
      language: "javascript",
      stage: 2,
      difficulty: "beginner",
      starterCode: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  // Add useEffect here to fetch data
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}`,
      testCases: [
        { input: "userId: 1", expected: "fetches and displays user", description: "Should fetch on mount" },
      ],
      hints: JSON.stringify(["Use useEffect with empty dependency array", "Fetch inside useEffect"]),
    },
    {
      conceptId: hooksConcept.id,
      title: "Fix Memory Leak",
      description: "This component has a memory leak. Fix it by adding cleanup.",
      language: "javascript",
      stage: 3,
      difficulty: "intermediate",
      starterCode: `function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    // Fix: add cleanup here
  }, []);
  
  return <div>{seconds}s</div>;
}`,
      testCases: [
        { input: "mount/unmount", expected: "interval cleared on unmount", description: "Should clear interval" },
      ],
      hints: JSON.stringify(["Return a cleanup function from useEffect", "Call clearInterval in cleanup"]),
    },
    {
      conceptId: hooksConcept.id,
      title: "Create a useDebounce Hook",
      description: "Implement a custom hook that debounces a value.",
      language: "javascript",
      stage: 4,
      difficulty: "advanced",
      starterCode: `function useDebounce(value, delay) {
  // Your implementation here
  // Should return the debounced value
}

// Usage:
// const debouncedSearch = useDebounce(searchTerm, 500);`,
      testCases: [
        { input: "value changes rapidly", expected: "only updates after delay", description: "Should debounce updates" },
      ],
      hints: JSON.stringify(["Use useState to store debounced value", "Use useEffect with setTimeout", "Clear timeout on cleanup"]),
    },
    {
      conceptId: hooksConcept.id,
      title: "Build a usePrevious Hook",
      description: "Create a hook that returns the previous value of a state or prop.",
      language: "javascript",
      stage: 5,
      difficulty: "advanced",
      starterCode: `function usePrevious(value) {
  // Your implementation here
}

// Usage example:
// const [count, setCount] = useState(0);
// const prevCount = usePrevious(count);`,
      testCases: [
        { input: "value: 5 -> 10", expected: "returns 5", description: "Should return previous value" },
      ],
      hints: JSON.stringify(["Use useRef to store previous value", "Use useEffect to update ref", "Return ref.current"]),
    },
  ];

  await prisma.challenge.createMany({ data: hooksChallenges });
  console.log(`  ✓ Created ${hooksChallenges.length} challenges\n`);

  // ============================================================================
  // CONCEPT 3: CSS Flexbox
  // ============================================================================
  console.log("📚 Creating concept: CSS Flexbox");
  const flexboxConcept = await prisma.concept.create({
    data: {
      name: "CSS Flexbox",
      category: "CSS Layout",
      language: "CSS",
      difficulty: 1,
      description:
        "Master CSS Flexbox for modern, responsive layouts. Understand flex container and item properties, alignment, distribution, and common layout patterns.",
    },
  });

  const flexboxFlashcards = [
    {
      conceptId: flexboxConcept.id,
      type: "syntax",
      front: "How do you create a flex container?",
      back: "display: flex; or display: inline-flex;",
      codeExample: `.container {
  display: flex;
}`,
    },
    {
      conceptId: flexboxConcept.id,
      type: "syntax",
      front: "How do you center an item both horizontally and vertically in a flex container?",
      back: "justify-content: center; and align-items: center; on the container",
      codeExample: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`,
    },
    {
      conceptId: flexboxConcept.id,
      type: "concept",
      front: "What's the difference between justify-content and align-items?",
      back: "justify-content aligns along the MAIN axis (horizontal by default). align-items aligns along the CROSS axis (vertical by default).",
      codeExample: `.container {
  display: flex;
  justify-content: center;  /* horizontal centering */
  align-items: center;      /* vertical centering */
}`,
    },
    {
      conceptId: flexboxConcept.id,
      type: "concept",
      front: "What does flex: 1 mean?",
      back: "Shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%. The item will grow to fill available space and share it equally with other flex: 1 items.",
      codeExample: `.item {
  flex: 1; /* Same as: flex: 1 1 0%; */
}

/* Three items with flex: 1 each share space equally */`,
    },
    {
      conceptId: flexboxConcept.id,
      type: "prediction",
      front: "How much space does each item get?\n\n.container { width: 600px; display: flex; }\n.item { flex: 1; }\n\n(3 items in container)",
      back: "Each item gets 200px (600px / 3 items). They share space equally.",
      codeExample: null,
    },
    {
      conceptId: flexboxConcept.id,
      type: "prediction",
      front: "What happens with flex-direction: column?\n\n.container { display: flex; flex-direction: column; }",
      back: "Main axis becomes vertical, cross axis becomes horizontal. justify-content now controls vertical alignment, align-items controls horizontal.",
      codeExample: null,
    },
    {
      conceptId: flexboxConcept.id,
      type: "bug",
      front: "Why isn't this centering vertically?\n\n.container { display: flex; justify-content: center; height: 100vh; }",
      back: "justify-content centers on the main axis (horizontal). For vertical centering, need align-items: center;",
      codeExample: `.container {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical - ADD THIS */
  height: 100vh;
}`,
    },
    {
      conceptId: flexboxConcept.id,
      type: "bug",
      front: "Why are items overflowing?\n\n.container { display: flex; width: 200px; }\n.item { width: 100px; }\n\n(3 items)",
      back: "Total width (300px) exceeds container (200px). Items shrink by default (flex-shrink: 1) to fit, but you can prevent with flex-shrink: 0;",
      codeExample: `.item {
  width: 100px;
  flex-shrink: 0; /* Prevents shrinking */
}`,
    },
    {
      conceptId: flexboxConcept.id,
      type: "use_case",
      front: "When should you use flex-wrap: wrap?",
      back: "When you want items to wrap to the next line if they don't fit in one line. Useful for responsive grids, tag lists, or any multi-line flex layout.",
      codeExample: `.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
/* Tags wrap to new lines instead of shrinking */`,
    },
    {
      conceptId: flexboxConcept.id,
      type: "use_case",
      front: "How do you create a sticky footer using Flexbox?",
      back: "Make body a flex container with flex-direction: column and min-height: 100vh. Give main content flex: 1 to push footer down.",
      codeExample: `body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1; /* Grows to fill space */
}

footer {
  /* Stays at bottom */
}`,
    },
  ];

  await prisma.flashcard.createMany({ data: flexboxFlashcards });
  console.log(`  ✓ Created ${flexboxFlashcards.length} flashcards`);

  const flexboxChallenges = [
    {
      conceptId: flexboxConcept.id,
      title: "Center a Div",
      description: "Center a box both horizontally and vertically in a container.",
      language: "css",
      stage: 1,
      difficulty: "beginner",
      starterCode: `.container {
  display: flex;
  /* Add centering properties */
  height: 100vh;
}`,
      testCases: [
        { input: ".box element", expected: "centered in viewport", description: "Should center the box" },
      ],
      hints: JSON.stringify(["Use justify-content", "Use align-items"]),
    },
    {
      conceptId: flexboxConcept.id,
      title: "Create Navigation Bar",
      description: "Create a horizontal navigation bar with logo on left, menu items centered, and button on right.",
      language: "css",
      stage: 2,
      difficulty: "beginner",
      starterCode: `.nav {
  display: flex;
  /* Complete the layout */
}

.nav .logo { /* left */ }
.nav .menu { /* center */ }
.nav .button { /* right */ }`,
      testCases: [
        { input: "nav elements", expected: "logo left, menu center, button right", description: "Should distribute items" },
      ],
      hints: JSON.stringify(["Use justify-content: space-between", "Or use margin-left: auto on button"]),
    },
    {
      conceptId: flexboxConcept.id,
      title: "Fix Overflowing Grid",
      description: "Items are overflowing. Make them wrap to new lines when needed.",
      language: "css",
      stage: 3,
      difficulty: "intermediate",
      starterCode: `.grid {
  display: flex;
  /* Fix: items should wrap */
}

.item {
  width: 200px;
  /* Items overflow container */
}`,
      testCases: [
        { input: "multiple items", expected: "items wrap to new lines", description: "Should wrap items" },
      ],
      hints: JSON.stringify(["Add flex-wrap property", "Consider using gap for spacing"]),
    },
    {
      conceptId: flexboxConcept.id,
      title: "Create Card Layout",
      description: "Create a card with header, flexible body, and footer using Flexbox.",
      language: "css",
      stage: 4,
      difficulty: "intermediate",
      starterCode: `.card {
  display: flex;
  /* Your layout here */
  height: 400px;
}

.card-header { /* fixed height */ }
.card-body { /* grows to fill */ }
.card-footer { /* fixed height */ }`,
      testCases: [
        { input: "card elements", expected: "body fills space between header/footer", description: "Should create flexible layout" },
      ],
      hints: JSON.stringify(["Use flex-direction: column", "Use flex: 1 on body"]),
    },
    {
      conceptId: flexboxConcept.id,
      title: "Holy Grail Layout",
      description: "Implement the classic Holy Grail layout (header, sidebar, main, aside, footer) using only Flexbox.",
      language: "css",
      stage: 5,
      difficulty: "advanced",
      starterCode: `body {
  display: flex;
  /* Your implementation */
}

/* header: full width top */
/* sidebar: left, fixed width */
/* main: center, flexible */
/* aside: right, fixed width */
/* footer: full width bottom */`,
      testCases: [
        { input: "layout elements", expected: "correct Holy Grail structure", description: "Should create Holy Grail layout" },
      ],
      hints: JSON.stringify(["Use nested flex containers", "Column for outer, row for middle", "Use flex: 1 on main"]),
    },
  ];

  await prisma.challenge.createMany({ data: flexboxChallenges });
  console.log(`  ✓ Created ${flexboxChallenges.length} challenges\n`);

  // ============================================================================
  // CONCEPT 4: Python Async/Await
  // ============================================================================
  console.log("📚 Creating concept: Python Async/Await");
  const pythonAsyncConcept = await prisma.concept.create({
    data: {
      name: "Python Async/Await",
      category: "Async Programming",
      language: "Python",
      difficulty: 3,
      description:
        "Master asynchronous programming in Python with asyncio. Understand coroutines, event loops, concurrent execution, and common async patterns.",
    },
  });

  const pythonAsyncFlashcards = [
    {
      conceptId: pythonAsyncConcept.id,
      type: "syntax",
      front: "How do you define an async function in Python?",
      back: "Use 'async def' keyword: async def my_function():",
      codeExample: `async def fetch_data():
    # This is a coroutine
    return "data"`,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "syntax",
      front: "How do you run an async function?",
      back: "Use await inside another async function, or asyncio.run() from synchronous code",
      codeExample: `# Inside async function:
result = await fetch_data()

# From sync code:
asyncio.run(fetch_data())`,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "concept",
      front: "What's the difference between concurrent and parallel execution in asyncio?",
      back: "Concurrent: multiple tasks make progress during a single thread (I/O-bound). Parallel: multiple tasks run simultaneously on multiple cores (CPU-bound, needs multiprocessing).",
      codeExample: `# Concurrent (asyncio) - good for I/O
async def concurrent():
    await asyncio.gather(
        fetch_api1(),
        fetch_api2()
    )

# Parallel (multiprocessing) - good for CPU
from multiprocessing import Pool
pool.map(compute_intensive, data)`,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "concept",
      front: "When should you use asyncio.gather() vs asyncio.wait()?",
      back: "gather(): simpler, returns results in order, good for all-or-nothing. wait(): more control, can get partial results, can set timeouts and return_when conditions.",
      codeExample: `# gather - simpler
results = await asyncio.gather(
    task1(), task2(), task3()
)

# wait - more control
done, pending = await asyncio.wait(
    [task1(), task2()]),
    timeout=5,
    return_when=asyncio.FIRST_COMPLETED
)`,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "prediction",
      front: "What happens when you call an async function without await?\n\nasync def fetch(): return 'data'\nresult = fetch()\nprint(result)",
      back: "Prints a coroutine object, not 'data'. The function doesn't execute until awaited. You'll get: <coroutine object fetch at 0x...>",
      codeExample: null,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "prediction",
      front: "What order do these print?\n\nasync def main():\n    print('1')\n    await asyncio.sleep(0)\n    print('2')\n\nasyncio.run(main())\nprint('3')",
      back: "1, 2, 3. asyncio.run() blocks until main() completes, so '3' prints last.",
      codeExample: null,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "bug",
      front: "What's wrong with this code?\n\nasync def process_items(items):\n    for item in items:\n        result = await process(item)\n        results.append(result)",
      back: "Sequential processing! Processes items one at a time. Should use asyncio.gather() or create tasks to process concurrently.",
      codeExample: `# Fixed:
async def process_items(items):
    tasks = [process(item) for item in items]
    results = await asyncio.gather(*tasks)
    return results`,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "bug",
      front: "What's the issue?\n\nasync def get_data():\n    response = requests.get('https://api.example.com')\n    return response.json()",
      back: "Using blocking requests library in async function! This blocks the event loop. Should use async HTTP library like aiohttp or httpx.",
      codeExample: `# Fixed with aiohttp:
async def get_data():
    async with aiohttp.ClientSession() as session:
        async with session.get('https://api.example.com') as response:
            return await response.json()`,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "use_case",
      front: "When should you use asyncio over threading?",
      back: "Use asyncio for I/O-bound tasks (network requests, file I/O, database queries). Use threading for I/O-bound tasks with blocking libraries. Use multiprocessing for CPU-bound tasks.",
      codeExample: `# Good for asyncio:
- Web scraping (multiple URLs)
- API calls
- Database queries
- WebSocket connections

# Use threading for:
- Blocking I/O with non-async libraries

# Use multiprocessing for:
- CPU-intensive computations
- Data processing`,
    },
    {
      conceptId: pythonAsyncConcept.id,
      type: "use_case",
      front: "How do you implement a timeout for an async operation?",
      back: "Use asyncio.wait_for() to wrap the coroutine with a timeout.",
      codeExample: `async def fetch_with_timeout():
    try:
        result = await asyncio.wait_for(
            fetch_data(),
            timeout=5.0
        )
        return result
    except asyncio.TimeoutError:
        print("Request timed out")
        return None`,
    },
  ];

  await prisma.flashcard.createMany({ data: pythonAsyncFlashcards });
  console.log(`  ✓ Created ${pythonAsyncFlashcards.length} flashcards`);

  const pythonAsyncChallenges = [
    {
      conceptId: pythonAsyncConcept.id,
      title: "Create Async Sleep Function",
      description: "Create an async function that waits for a specified number of seconds.",
      language: "python",
      stage: 1,
      difficulty: "beginner",
      starterCode: `import asyncio

async def sleep_and_return(seconds, value):
    # Your code here: sleep for 'seconds', then return 'value'
    pass

# Test
asyncio.run(sleep_and_return(0.1, "Done"))`,
      testCases: [
        { input: "0.1, 'test'", expected: "'test' after 0.1s", description: "Should wait then return" },
      ],
      hints: JSON.stringify(["Use await asyncio.sleep()", "Return the value after sleeping"]),
    },
    {
      conceptId: pythonAsyncConcept.id,
      title: "Fetch Multiple URLs",
      description: "Complete the function to fetch multiple URLs concurrently.",
      language: "python",
      stage: 2,
      difficulty: "intermediate",
      starterCode: `import asyncio
import aiohttp

async def fetch_all(urls):
    # Complete: fetch all URLs concurrently
    async with aiohttp.ClientSession() as session:
        # Your code here
        pass

urls = ["https://example.com", "https://example.org"]
asyncio.run(fetch_all(urls))`,
      testCases: [
        { input: "multiple URLs", expected: "all responses", description: "Should fetch concurrently" },
      ],
      hints: JSON.stringify(["Create a task for each URL", "Use asyncio.gather()"]),
    },
    {
      conceptId: pythonAsyncConcept.id,
      title: "Fix Sequential Processing",
      description: "This code processes items sequentially. Make it concurrent.",
      language: "python",
      stage: 3,
      difficulty: "intermediate",
      starterCode: `import asyncio

async def process_item(item):
    await asyncio.sleep(0.1)
    return item * 2

async def process_all(items):
    results = []
    for item in items:
        result = await process_item(item)  # Fix this!
        results.append(result)
    return results

asyncio.run(process_all([1, 2, 3, 4, 5]))`,
      testCases: [
        { input: "[1,2,3]", expected: "[2,4,6] in parallel", description: "Should process concurrently" },
      ],
      hints: JSON.stringify(["Create tasks before awaiting", "Use asyncio.gather()"]),
    },
    {
      conceptId: pythonAsyncConcept.id,
      title: "Implement Retry with Exponential Backoff",
      description: "Create an async retry function with exponential backoff.",
      language: "python",
      stage: 4,
      difficulty: "advanced",
      starterCode: `import asyncio

async def retry_with_backoff(coro, max_attempts=3, base_delay=1):
    # Your implementation here
    # Wait base_delay * (2 ** attempt) between retries
    pass

# Test with a function that fails twice then succeeds
attempts = 0
async def flaky():
    global attempts
    attempts += 1
    if attempts < 3:
        raise Exception("Failed")
    return "Success"`,
      testCases: [
        { input: "flaky function", expected: "succeeds after retries", description: "Should retry with backoff" },
      ],
      hints: JSON.stringify(["Use try/except in a loop", "Calculate delay: base_delay * (2 ** attempt)", "await asyncio.sleep(delay)"]),
    },
    {
      conceptId: pythonAsyncConcept.id,
      title: "Build an Async Queue Processor",
      description: "Create a worker pool that processes items from an async queue.",
      language: "python",
      stage: 5,
      difficulty: "advanced",
      starterCode: `import asyncio

async def worker(queue, worker_id):
    # Your implementation: process items from queue
    pass

async def main():
    queue = asyncio.Queue()
    
    # Add items to queue
    for i in range(10):
        await queue.put(i)
    
    # Create worker pool (3 workers)
    workers = [
        asyncio.create_task(worker(queue, i))
        for i in range(3)
    ]
    
    # Wait for queue to be processed
    await queue.join()
    
    # Cancel workers
    for w in workers:
        w.cancel()

asyncio.run(main())`,
      testCases: [
        { input: "10 items, 3 workers", expected: "all items processed", description: "Should process with worker pool" },
      ],
      hints: JSON.stringify(["Use queue.get() in loop", "Call queue.task_done()", "Handle queue empty with try/except"]),
    },
  ];

  await prisma.challenge.createMany({ data: pythonAsyncChallenges });
  console.log(`  ✓ Created ${pythonAsyncChallenges.length} challenges\n`);

  // ========================================
  // CONCEPT 5: TypeScript Fundamentals
  // ========================================
  const typescript = await prisma.concept.create({
    data: {
      name: "TypeScript Fundamentals",
      description: "Static typing for JavaScript - interfaces, types, and generics",
      category: "Programming Language",
      language: "typescript",
      difficulty: 3,
    },
  });

  // TypeScript Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: typescript.id,
        type: "syntax",
        front: "How do you define a basic type annotation for a variable?",
        back: "Use a colon followed by the type: let name: string = 'Alice';",
        codeExample: "let age: number = 25;\nlet isActive: boolean = true;\nlet user: string = 'John';",
      },
      {
        conceptId: typescript.id,
        type: "concept",
        front: "What is the difference between 'interface' and 'type' in TypeScript?",
        back: "Both define shapes of objects, but interfaces can be extended and merged, while types are more flexible for unions and intersections.",
        codeExample: "interface User { name: string; }\ntype ID = string | number;\n\ninterface Admin extends User { role: string; }\ntype Point = { x: number; y: number; };",
      },
      {
        conceptId: typescript.id,
        type: "syntax",
        front: "How do you define an interface for an object?",
        back: "Use the 'interface' keyword followed by property definitions with types.",
        codeExample: "interface Person {\n  name: string;\n  age: number;\n  email?: string; // optional\n  readonly id: number; // readonly\n}",
      },
      {
        conceptId: typescript.id,
        type: "prediction",
        front: "What will TypeScript infer as the type?\nlet nums = [1, 2, 3];",
        back: "number[] - TypeScript infers an array of numbers based on the initial values.",
        codeExample: "let nums = [1, 2, 3]; // number[]\nlet mixed = [1, 'two']; // (number | string)[]",
      },
      {
        conceptId: typescript.id,
        type: "bug",
        front: "Find the error:\nfunction greet(name: string): number {\n  return `Hello ${name}`;\n}",
        back: "Return type is 'number' but the function returns a string. Change return type to 'string'.",
        codeExample: "// Fixed:\nfunction greet(name: string): string {\n  return `Hello ${name}`;\n}",
      },
      {
        conceptId: typescript.id,
        type: "use_case",
        front: "When should you use generics in TypeScript?",
        back: "Use generics when you want to create reusable components that work with multiple types while maintaining type safety.",
        codeExample: "function identity<T>(arg: T): T {\n  return arg;\n}\n\nconst num = identity<number>(42);\nconst str = identity<string>('hello');",
      },
      {
        conceptId: typescript.id,
        type: "syntax",
        front: "How do you define a union type?",
        back: "Use the pipe (|) operator to combine multiple types.",
        codeExample: "type Status = 'pending' | 'approved' | 'rejected';\ntype ID = string | number;\n\nlet userId: ID = 123;\nuserId = 'abc-456';",
      },
      {
        conceptId: typescript.id,
        type: "concept",
        front: "What is type assertion and when is it used?",
        back: "Type assertion tells TypeScript to treat a value as a specific type when you know more about the type than TypeScript can infer.",
        codeExample: "let someValue: unknown = 'hello';\nlet strLength: number = (someValue as string).length;\n// or\nlet len = (<string>someValue).length;",
      },
      {
        conceptId: typescript.id,
        type: "use_case",
        front: "What is the 'never' type used for?",
        back: "The 'never' type represents values that never occur - used for functions that never return or throw errors.",
        codeExample: "function throwError(msg: string): never {\n  throw new Error(msg);\n}\n\nfunction infinite(): never {\n  while(true) {}\n}",
      },
      {
        conceptId: typescript.id,
        type: "concept",
        front: "What is the purpose of utility types like Partial<T> and Required<T>?",
        back: "Utility types transform existing types. Partial makes all properties optional, Required makes them all required.",
        codeExample: "interface User { name: string; age: number; }\n\ntype PartialUser = Partial<User>; // all optional\ntype RequiredUser = Required<User>; // all required",
      },
    ],
  });

  // TypeScript Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: typescript.id,
        title: "Type Annotations Basics",
        description: "Create typed variables and a function with parameter and return type annotations",
        language: "typescript",
        difficulty: "beginner",
        stage: 1,
        starterCode: "// Define a typed function that takes a name and age\n// and returns a greeting string\n\nfunction createGreeting(name, age) {\n  return `Hello, ${name}! You are ${age} years old.`;\n}\n\nconsole.log(createGreeting('Alice', 25));",
        testCases: JSON.stringify([
          { input: "createGreeting('Alice', 25)", expected: "Hello, Alice! You are 25 years old.", description: "Should greet Alice" },
          { input: "createGreeting('Bob', 30)", expected: "Hello, Bob! You are 30 years old.", description: "Should greet Bob" },
        ]),
        hints: JSON.stringify([
          "Add ': string' after the name parameter",
          "Add ': number' after the age parameter",
          "Add ': string' before the function body to specify return type",
        ]),
      },
      {
        conceptId: typescript.id,
        title: "Interface Definition",
        description: "Define an interface for a user object and create a function that accepts it",
        language: "typescript",
        difficulty: "beginner",
        stage: 2,
        starterCode: "// Define a User interface with name, email, and optional age\n// Then create a function that accepts a User and returns a display string\n\nfunction displayUser(user) {\n  return `${user.name} (${user.email})`;\n}\n\nconst user = { name: 'Alice', email: 'alice@example.com' };\nconsole.log(displayUser(user));",
        testCases: JSON.stringify([
          { input: "displayUser({ name: 'Alice', email: 'alice@example.com' })", expected: "Alice (alice@example.com)", description: "Should display user" },
        ]),
        hints: JSON.stringify([
          "Define 'interface User { name: string; email: string; age?: number; }'",
          "Add '(user: User)' as the function parameter type",
          "Use optional properties with '?' for age",
        ]),
      },
      {
        conceptId: typescript.id,
        title: "Generic Function",
        description: "Create a generic function that works with any array type",
        language: "typescript",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "// Create a generic function that returns the first element of an array\n\nfunction getFirst(arr) {\n  return arr[0];\n}\n\nconsole.log(getFirst([1, 2, 3]));\nconsole.log(getFirst(['a', 'b', 'c']));",
        testCases: JSON.stringify([
          { input: "getFirst([1, 2, 3])", expected: "1", description: "Should get first number" },
          { input: "getFirst(['a', 'b'])", expected: "a", description: "Should get first string" },
        ]),
        hints: JSON.stringify([
          "Add <T> before the function parameters",
          "Use 'arr: T[]' as the parameter type",
          "Return type should be 'T'",
        ]),
      },
      {
        conceptId: typescript.id,
        title: "Union Types",
        description: "Create a function that handles multiple input types using union types",
        language: "typescript",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "// Create a function that formats an ID as string\n// Accept both string and number IDs\n\nfunction formatId(id) {\n  return `ID: ${id}`;\n}\n\nconsole.log(formatId(123));\nconsole.log(formatId('ABC'));",
        testCases: JSON.stringify([
          { input: "formatId(123)", expected: "ID: 123", description: "Should format number ID" },
          { input: "formatId('ABC')", expected: "ID: ABC", description: "Should format string ID" },
        ]),
        hints: JSON.stringify([
          "Use 'id: string | number' for the parameter type",
          "Template literals work with both types",
        ]),
      },
      {
        conceptId: typescript.id,
        title: "Type Guards",
        description: "Implement type narrowing with typeof checks",
        language: "typescript",
        difficulty: "advanced",
        stage: 5,
        starterCode: "// Create a function that doubles a number or repeats a string\n\nfunction double(value) {\n  if (typeof value === 'number') {\n    return value * 2;\n  } else {\n    return value + value;\n  }\n}\n\nconsole.log(double(5));\nconsole.log(double('Hi'));",
        testCases: JSON.stringify([
          { input: "double(5)", expected: "10", description: "Should double number" },
          { input: "double('Hi')", expected: "HiHi", description: "Should repeat string" },
        ]),
        hints: JSON.stringify([
          "Use 'value: number | string' for the parameter",
          "Return type should be 'number | string'",
          "Type guards with typeof narrow the type automatically",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 6: SQL Basics
  // ========================================
  const sql = await prisma.concept.create({
    data: {
      name: "SQL Basics",
      description: "Database queries - SELECT, JOIN, WHERE, and data manipulation",
      category: "Database",
      language: "sql",
      difficulty: 2,
    },
  });

  // SQL Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: sql.id,
        type: "syntax",
        front: "How do you select all columns from a table?",
        back: "Use SELECT * FROM table_name;",
        codeExample: "SELECT * FROM users;\n-- or select specific columns:\nSELECT name, email FROM users;",
      },
      {
        conceptId: sql.id,
        type: "concept",
        front: "What is the difference between INNER JOIN and LEFT JOIN?",
        back: "INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table and matching rows from the right (or NULL).",
        codeExample: "-- INNER JOIN\nSELECT * FROM orders INNER JOIN users ON orders.user_id = users.id;\n\n-- LEFT JOIN\nSELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id;",
      },
      {
        conceptId: sql.id,
        type: "syntax",
        front: "How do you filter results with a WHERE clause?",
        back: "Add WHERE followed by a condition after the FROM clause.",
        codeExample: "SELECT * FROM users WHERE age > 18;\nSELECT * FROM products WHERE price BETWEEN 10 AND 50;\nSELECT * FROM users WHERE name LIKE 'A%';",
      },
      {
        conceptId: sql.id,
        type: "prediction",
        front: "What does this query return?\nSELECT COUNT(*) FROM users WHERE active = true;",
        back: "The number of active users - COUNT(*) returns the total count of rows matching the condition.",
        codeExample: "SELECT COUNT(*) FROM users WHERE active = true;\n-- Returns: one row with the count number",
      },
      {
        conceptId: sql.id,
        type: "bug",
        front: "Find the error:\nSELECT name, COUNT(*) FROM users GROUP BY age;",
        back: "The GROUP BY clause should include 'name' since it's in SELECT but not aggregated. Either remove 'name' or add it to GROUP BY.",
        codeExample: "-- Fixed:\nSELECT age, COUNT(*) FROM users GROUP BY age;\n-- or\nSELECT name, age, COUNT(*) FROM users GROUP BY name, age;",
      },
      {
        conceptId: sql.id,
        type: "use_case",
        front: "When should you use an INDEX on a database column?",
        back: "Use indexes on columns frequently used in WHERE, JOIN, or ORDER BY clauses to speed up queries. Avoid over-indexing as it slows inserts/updates.",
        codeExample: "CREATE INDEX idx_email ON users(email);\nCREATE INDEX idx_created ON orders(created_at);",
      },
      {
        conceptId: sql.id,
        type: "syntax",
        front: "How do you insert a new row into a table?",
        back: "Use INSERT INTO table_name (columns) VALUES (values);",
        codeExample: "INSERT INTO users (name, email, age)\nVALUES ('Alice', 'alice@example.com', 25);\n\n-- Multiple rows:\nINSERT INTO users (name, email)\nVALUES ('Bob', 'bob@example.com'), ('Carol', 'carol@example.com');",
      },
      {
        conceptId: sql.id,
        type: "concept",
        front: "What is the purpose of the ORDER BY clause?",
        back: "ORDER BY sorts the result set by one or more columns in ascending (ASC) or descending (DESC) order.",
        codeExample: "SELECT * FROM users ORDER BY age DESC;\nSELECT * FROM products ORDER BY price ASC, name ASC;",
      },
      {
        conceptId: sql.id,
        type: "use_case",
        front: "What does the HAVING clause do and how is it different from WHERE?",
        back: "HAVING filters groups after GROUP BY (works with aggregates), while WHERE filters rows before grouping.",
        codeExample: "-- HAVING with aggregate\nSELECT category, COUNT(*) FROM products \nGROUP BY category HAVING COUNT(*) > 10;\n\n-- WHERE filters before grouping\nSELECT category, COUNT(*) FROM products \nWHERE price > 100 GROUP BY category;",
      },
      {
        conceptId: sql.id,
        type: "syntax",
        front: "How do you update existing records in a table?",
        back: "Use UPDATE table_name SET column = value WHERE condition;",
        codeExample: "UPDATE users SET age = 26 WHERE name = 'Alice';\nUPDATE products SET price = price * 0.9 WHERE category = 'sale';",
      },
    ],
  });

  // SQL Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: sql.id,
        title: "Basic SELECT Query",
        description: "Write a query to select specific columns from a table",
        language: "sql",
        difficulty: "beginner",
        stage: 1,
        starterCode: "-- Select the name and email columns from the users table\n-- Your query here:",
        testCases: JSON.stringify([
          { input: "SELECT", expected: "name, email", description: "Should select name and email" },
        ]),
        hints: JSON.stringify([
          "Use SELECT column1, column2 FROM table_name",
          "Separate column names with commas",
        ]),
      },
      {
        conceptId: sql.id,
        title: "WHERE Clause Filtering",
        description: "Filter results based on a condition",
        language: "sql",
        difficulty: "beginner",
        stage: 2,
        starterCode: "-- Select all users where age is greater than 18\n-- Your query here:",
        testCases: JSON.stringify([
          { input: "WHERE age > 18", expected: "filtered results", description: "Should filter by age" },
        ]),
        hints: JSON.stringify([
          "Use WHERE after FROM clause",
          "Syntax: WHERE column_name > value",
        ]),
      },
      {
        conceptId: sql.id,
        title: "JOIN Two Tables",
        description: "Combine data from users and orders tables",
        language: "sql",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "-- Join users and orders tables on user_id\n-- Select user name and order total\n-- Your query here:",
        testCases: JSON.stringify([
          { input: "JOIN orders", expected: "combined data", description: "Should join tables" },
        ]),
        hints: JSON.stringify([
          "Use INNER JOIN or LEFT JOIN",
          "Specify the join condition with ON",
          "Format: FROM users JOIN orders ON users.id = orders.user_id",
        ]),
      },
      {
        conceptId: sql.id,
        title: "GROUP BY and Aggregates",
        description: "Count users by country using GROUP BY",
        language: "sql",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "-- Count the number of users in each country\n-- Show country and count\n-- Your query here:",
        testCases: JSON.stringify([
          { input: "GROUP BY country", expected: "grouped counts", description: "Should group by country" },
        ]),
        hints: JSON.stringify([
          "Use COUNT(*) to count rows",
          "Add GROUP BY country",
          "Format: SELECT country, COUNT(*) FROM users GROUP BY country",
        ]),
      },
      {
        conceptId: sql.id,
        title: "Complex Query with HAVING",
        description: "Find categories with more than 10 products",
        language: "sql",
        difficulty: "advanced",
        stage: 5,
        starterCode: "-- Select categories that have more than 10 products\n-- Show category and product count\n-- Your query here:",
        testCases: JSON.stringify([
          { input: "HAVING COUNT(*) > 10", expected: "filtered groups", description: "Should filter groups" },
        ]),
        hints: JSON.stringify([
          "Use GROUP BY category first",
          "Add HAVING clause after GROUP BY",
          "HAVING filters after grouping, WHERE filters before",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 7: Git & Version Control
  // ========================================
  const git = await prisma.concept.create({
    data: {
      name: "Git & Version Control",
      description: "Version control fundamentals - commits, branches, merges, and collaboration",
      category: "Tools",
      language: null,
      difficulty: 2,
    },
  });

  // Git Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: git.id,
        type: "syntax",
        front: "How do you initialize a new Git repository?",
        back: "Use 'git init' in the project directory to create a new .git folder.",
        codeExample: "git init\n# Creates .git directory for version control",
      },
      {
        conceptId: git.id,
        type: "concept",
        front: "What is the difference between 'git add' and 'git commit'?",
        back: "'git add' stages changes for commit (adds to staging area). 'git commit' saves staged changes to the repository with a message.",
        codeExample: "git add file.txt       # Stage a file\ngit add .              # Stage all changes\ngit commit -m 'Add feature'  # Commit with message",
      },
      {
        conceptId: git.id,
        type: "syntax",
        front: "How do you create and switch to a new branch?",
        back: "Use 'git checkout -b branch-name' or 'git switch -c branch-name' (newer syntax).",
        codeExample: "git checkout -b feature-login\n# or\ngit switch -c feature-login",
      },
      {
        conceptId: git.id,
        type: "prediction",
        front: "What happens when you run 'git pull origin main'?",
        back: "Git fetches changes from the remote 'main' branch and merges them into your current local branch.",
        codeExample: "git pull origin main\n# Equivalent to:\n# git fetch origin main\n# git merge origin/main",
      },
      {
        conceptId: git.id,
        type: "bug",
        front: "You committed sensitive data by mistake. How do you remove it from history?",
        back: "Use 'git reset HEAD~1' to undo the last commit (keeps changes), then use .gitignore to prevent re-committing.",
        codeExample: "git reset HEAD~1          # Undo last commit, keep changes\ngit reset --hard HEAD~1   # Undo and discard changes\n\n# Add to .gitignore:\necho '.env' >> .gitignore",
      },
      {
        conceptId: git.id,
        type: "use_case",
        front: "When should you use 'git rebase' instead of 'git merge'?",
        back: "Use rebase to keep a linear history when integrating changes from one branch to another. Avoid rebasing shared/public branches.",
        codeExample: "# On feature branch:\ngit rebase main\n\n# Results in linear history vs merge's branching history",
      },
      {
        conceptId: git.id,
        type: "syntax",
        front: "How do you undo changes to a file before committing?",
        back: "Use 'git restore file.txt' to discard working directory changes.",
        codeExample: "git restore file.txt      # Discard changes\ngit restore --staged file.txt  # Unstage file",
      },
      {
        conceptId: git.id,
        type: "concept",
        front: "What is the purpose of .gitignore?",
        back: ".gitignore specifies files and directories that Git should not track - useful for secrets, dependencies, and build artifacts.",
        codeExample: "# .gitignore\nnode_modules/\n.env\n*.log\ndist/\n.DS_Store",
      },
      {
        conceptId: git.id,
        type: "use_case",
        front: "How do you resolve a merge conflict?",
        back: "Open conflicted files, manually edit to resolve conflicts between <<<, ===, >>> markers, then add and commit the resolved files.",
        codeExample: "# After merge conflict:\n# 1. Edit conflicted files\n# 2. Remove conflict markers\ngit add resolved-file.txt\ngit commit -m 'Resolve merge conflict'",
      },
      {
        conceptId: git.id,
        type: "syntax",
        front: "How do you view the commit history?",
        back: "Use 'git log' to see commit history, or 'git log --oneline' for a compact view.",
        codeExample: "git log\ngit log --oneline\ngit log --graph --all",
      },
    ],
  });

  // Git Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: git.id,
        title: "Basic Git Workflow",
        description: "Stage and commit a file with a message",
        language: "bash",
        difficulty: "beginner",
        stage: 1,
        starterCode: "# Stage all changes and commit with message 'Initial commit'\n# Your commands:",
        testCases: JSON.stringify([
          { input: "git add .", expected: "staged", description: "Should stage all files" },
          { input: "git commit -m", expected: "committed", description: "Should commit with message" },
        ]),
        hints: JSON.stringify([
          "Use 'git add .' to stage all changes",
          "Use 'git commit -m \"message\"' to commit",
        ]),
      },
      {
        conceptId: git.id,
        title: "Create a Branch",
        description: "Create and switch to a new feature branch",
        language: "bash",
        difficulty: "beginner",
        stage: 2,
        starterCode: "# Create and switch to a new branch called 'feature-navbar'\n# Your command:",
        testCases: JSON.stringify([
          { input: "git checkout -b", expected: "new branch", description: "Should create and switch" },
        ]),
        hints: JSON.stringify([
          "Use 'git checkout -b branch-name'",
          "Or 'git switch -c branch-name'",
        ]),
      },
      {
        conceptId: git.id,
        title: "Push to Remote",
        description: "Push your branch to the remote repository",
        language: "bash",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "# Push your current branch to origin\n# Your command:",
        testCases: JSON.stringify([
          { input: "git push origin", expected: "pushed", description: "Should push to remote" },
        ]),
        hints: JSON.stringify([
          "Use 'git push origin branch-name'",
          "Or 'git push -u origin branch-name' to set upstream",
        ]),
      },
      {
        conceptId: git.id,
        title: "Merge Branch",
        description: "Merge a feature branch into main",
        language: "bash",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "# Switch to main and merge the feature branch\n# Your commands:",
        testCases: JSON.stringify([
          { input: "git checkout main", expected: "switched", description: "Should switch to main" },
          { input: "git merge feature", expected: "merged", description: "Should merge branch" },
        ]),
        hints: JSON.stringify([
          "First: 'git checkout main'",
          "Then: 'git merge feature-branch'",
        ]),
      },
      {
        conceptId: git.id,
        title: "Rebase Workflow",
        description: "Rebase your feature branch onto main",
        language: "bash",
        difficulty: "advanced",
        stage: 5,
        starterCode: "# On feature branch, rebase onto main\n# Your command:",
        testCases: JSON.stringify([
          { input: "git rebase main", expected: "rebased", description: "Should rebase onto main" },
        ]),
        hints: JSON.stringify([
          "Use 'git rebase main' while on feature branch",
          "Creates linear history",
          "May need to resolve conflicts",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 8: HTTP & REST APIs
  // ========================================
  const http = await prisma.concept.create({
    data: {
      name: "HTTP & REST APIs",
      description: "Web protocols - HTTP methods, status codes, RESTful design patterns",
      category: "Web Development",
      language: null,
      difficulty: 3,
    },
  });

  // HTTP Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: http.id,
        type: "concept",
        front: "What are the main HTTP methods and their purposes?",
        back: "GET (retrieve), POST (create), PUT (update/replace), PATCH (partial update), DELETE (remove).",
        codeExample: "GET /api/users      // Get all users\nPOST /api/users     // Create user\nPUT /api/users/1    // Update user 1\nDELETE /api/users/1 // Delete user 1",
      },
      {
        conceptId: http.id,
        type: "concept",
        front: "What do 2xx, 4xx, and 5xx HTTP status codes mean?",
        back: "2xx = Success, 4xx = Client Error (bad request), 5xx = Server Error.",
        codeExample: "200 OK - Success\n201 Created - Resource created\n400 Bad Request - Invalid data\n404 Not Found - Resource not found\n500 Internal Server Error",
      },
      {
        conceptId: http.id,
        type: "concept",
        front: "What makes an API RESTful?",
        back: "REST APIs use standard HTTP methods, are stateless, use resource-based URLs, and return standard formats (JSON/XML).",
        codeExample: "// RESTful design\nGET    /api/products      // List\nGET    /api/products/123  // Get one\nPOST   /api/products      // Create\nPUT    /api/products/123  // Update\nDELETE /api/products/123  // Delete",
      },
      {
        conceptId: http.id,
        type: "use_case",
        front: "When should you use POST vs PUT vs PATCH?",
        back: "POST for creating new resources. PUT for replacing entire resources. PATCH for partial updates.",
        codeExample: "// POST - Create new\nPOST /api/users { name, email }\n\n// PUT - Replace entire\nPUT /api/users/1 { name, email, age }\n\n// PATCH - Partial update\nPATCH /api/users/1 { age: 26 }",
      },
      {
        conceptId: http.id,
        type: "concept",
        front: "What is CORS and why is it needed?",
        back: "Cross-Origin Resource Sharing allows servers to specify which origins can access their resources, preventing unauthorized cross-origin requests.",
        codeExample: "// Server response headers\nAccess-Control-Allow-Origin: https://example.com\nAccess-Control-Allow-Methods: GET, POST\nAccess-Control-Allow-Headers: Content-Type",
      },
      {
        conceptId: http.id,
        type: "syntax",
        front: "How do you send JSON data in a fetch POST request?",
        back: "Set method to POST, Content-Type header to application/json, and stringify the body.",
        codeExample: "fetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Alice', age: 25 })\n});",
      },
      {
        conceptId: http.id,
        type: "prediction",
        front: "What happens if you send a PUT request without authentication to a protected endpoint?",
        back: "The server should return 401 Unauthorized (if auth missing) or 403 Forbidden (if auth insufficient).",
        codeExample: "PUT /api/admin/users/1\n// Without auth header\n\n// Response: 401 Unauthorized\n{ error: 'Authentication required' }",
      },
      {
        conceptId: http.id,
        type: "bug",
        front: "Find the error:\nfetch('/api/data', {\n  method: 'POST',\n  body: { name: 'Alice' }\n})",
        back: "The body should be JSON.stringify'd and Content-Type header should be set.",
        codeExample: "// Fixed:\nfetch('/api/data', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Alice' })\n});",
      },
      {
        conceptId: http.id,
        type: "concept",
        front: "What is the difference between authentication and authorization?",
        back: "Authentication verifies identity (who you are). Authorization determines permissions (what you can do).",
        codeExample: "// Authentication\nPOST /api/login { email, password }\n// Returns: JWT token\n\n// Authorization\nGET /api/admin/users\nAuthorization: Bearer <token>\n// Server checks if token has admin role",
      },
      {
        conceptId: http.id,
        type: "use_case",
        front: "When should you use query parameters vs path parameters vs request body?",
        back: "Path params for resource IDs. Query params for filters/options. Request body for data being created/updated.",
        codeExample: "// Path param (resource ID)\nGET /api/users/123\n\n// Query params (filters)\nGET /api/users?role=admin&limit=10\n\n// Request body (data)\nPOST /api/users\n{ name: 'Alice', email: 'alice@example.com' }",
      },
    ],
  });

  // HTTP Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: http.id,
        title: "Basic GET Request",
        description: "Fetch data from an API endpoint",
        language: "javascript",
        difficulty: "beginner",
        stage: 1,
        starterCode: "// Fetch users from /api/users and log the response\n\nasync function getUsers() {\n  // Your code here\n}\n\ngetUsers();",
        testCases: JSON.stringify([
          { input: "fetch('/api/users')", expected: "data fetched", description: "Should fetch users" },
        ]),
        hints: JSON.stringify([
          "Use fetch() with the URL",
          "await the response",
          "Use .json() to parse the response",
        ]),
      },
      {
        conceptId: http.id,
        title: "POST Request with JSON",
        description: "Create a new user with a POST request",
        language: "javascript",
        difficulty: "beginner",
        stage: 2,
        starterCode: "// Send POST request to create a user\n\nasync function createUser(name, email) {\n  // Your code here\n}\n\ncreateUser('Alice', 'alice@example.com');",
        testCases: JSON.stringify([
          { input: "createUser('Alice', 'alice@example.com')", expected: "user created", description: "Should create user" },
        ]),
        hints: JSON.stringify([
          "Use method: 'POST'",
          "Set Content-Type header to application/json",
          "Use JSON.stringify() on the body",
        ]),
      },
      {
        conceptId: http.id,
        title: "Handle API Errors",
        description: "Add error handling to API requests",
        language: "javascript",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "// Fetch user and handle errors appropriately\n\nasync function getUser(id) {\n  const response = await fetch(`/api/users/${id}`);\n  return await response.json();\n}\n\ngetUser(999);",
        testCases: JSON.stringify([
          { input: "getUser(999)", expected: "error handled", description: "Should handle 404" },
        ]),
        hints: JSON.stringify([
          "Check response.ok before parsing",
          "Throw error for non-200 status",
          "Use try/catch for error handling",
        ]),
      },
      {
        conceptId: http.id,
        title: "RESTful Update",
        description: "Update a resource with PATCH",
        language: "javascript",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "// Update only the age of user with PATCH\n\nasync function updateUserAge(id, age) {\n  // Your code here\n}\n\nupdateUserAge(1, 26);",
        testCases: JSON.stringify([
          { input: "updateUserAge(1, 26)", expected: "user updated", description: "Should update age" },
        ]),
        hints: JSON.stringify([
          "Use method: 'PATCH' for partial update",
          "Send only the fields being updated",
          "Include Content-Type header",
        ]),
      },
      {
        conceptId: http.id,
        title: "Query Parameters",
        description: "Build a URL with query parameters for filtering",
        language: "javascript",
        difficulty: "advanced",
        stage: 5,
        starterCode: "// Fetch users with filters: role='admin' and limit=10\n\nasync function getAdminUsers(role, limit) {\n  // Build URL with query params\n  // Your code here\n}\n\ngetAdminUsers('admin', 10);",
        testCases: JSON.stringify([
          { input: "getAdminUsers('admin', 10)", expected: "filtered users", description: "Should filter with query params" },
        ]),
        hints: JSON.stringify([
          "Use URLSearchParams to build query string",
          "Or manually: /api/users?role=admin&limit=10",
          "Remember to encode special characters",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 9: CSS Grid Layout
  // ========================================
  const cssGrid = await prisma.concept.create({
    data: {
      name: "CSS Grid Layout",
      description: "Two-dimensional layouts - grid templates, areas, and responsive design",
      category: "Styling",
      language: "css",
      difficulty: 3,
    },
  });

  // CSS Grid Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: cssGrid.id,
        type: "syntax",
        front: "How do you create a basic grid container?",
        back: "Set display: grid on the parent element and define rows/columns.",
        codeExample: ".container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: auto;\n  gap: 20px;\n}",
      },
      {
        conceptId: cssGrid.id,
        type: "concept",
        front: "What does the 'fr' unit mean in CSS Grid?",
        back: "'fr' is a fractional unit that represents a fraction of the available space in the grid container.",
        codeExample: ".grid {\n  grid-template-columns: 1fr 2fr 1fr;\n  /* Creates 3 columns: 25%, 50%, 25% */\n}",
      },
      {
        conceptId: cssGrid.id,
        type: "syntax",
        front: "How do you make a grid item span multiple columns?",
        back: "Use grid-column: span n or grid-column: start / end.",
        codeExample: ".item {\n  grid-column: span 2;  /* Span 2 columns */\n  /* or */\n  grid-column: 1 / 3;   /* From line 1 to 3 */\n}",
      },
      {
        conceptId: cssGrid.id,
        type: "prediction",
        front: "How many columns will this create?\ngrid-template-columns: repeat(3, 1fr);",
        back: "3 equal-width columns. The repeat() function creates 3 columns of 1fr each.",
        codeExample: ".grid {\n  grid-template-columns: repeat(3, 1fr);\n  /* Same as: 1fr 1fr 1fr */\n}",
      },
      {
        conceptId: cssGrid.id,
        type: "bug",
        front: "Why isn't the grid working?\n.container {\n  display: flex;\n  grid-template-columns: 1fr 1fr;\n}",
        back: "display is set to flex instead of grid. Change to display: grid.",
        codeExample: "/* Fixed: */\n.container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}",
      },
      {
        conceptId: cssGrid.id,
        type: "use_case",
        front: "When should you use CSS Grid vs Flexbox?",
        back: "Use Grid for 2D layouts (rows AND columns). Use Flexbox for 1D layouts (either row OR column).",
        codeExample: "/* Grid: 2D layout */\n.grid {\n  display: grid;\n  grid-template: 3fr 1fr / 200px 1fr;\n}\n\n/* Flexbox: 1D layout */\n.flex {\n  display: flex;\n  flex-direction: row;\n}",
      },
      {
        conceptId: cssGrid.id,
        type: "concept",
        front: "What does grid-template-areas do?",
        back: "Defines named grid areas using a visual representation with strings, making layouts more readable.",
        codeExample: ".container {\n  grid-template-areas:\n    'header header header'\n    'sidebar content content'\n    'footer footer footer';\n}\n\n.header { grid-area: header; }",
      },
      {
        conceptId: cssGrid.id,
        type: "syntax",
        front: "How do you create a responsive grid with auto-fit?",
        back: "Use repeat(auto-fit, minmax(min, max)) to create responsive columns.",
        codeExample: ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n}",
      },
      {
        conceptId: cssGrid.id,
        type: "use_case",
        front: "What is the difference between auto-fit and auto-fill?",
        back: "auto-fit collapses empty tracks. auto-fill keeps them, creating a minimum number of columns.",
        codeExample: "/* auto-fit: stretches to fill */\ngrid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n\n/* auto-fill: maintains min columns */\ngrid-template-columns: repeat(auto-fill, minmax(200px, 1fr));",
      },
      {
        conceptId: cssGrid.id,
        type: "syntax",
        front: "How do you align items within their grid cells?",
        back: "Use justify-items (horizontal) and align-items (vertical) on the container, or justify-self/align-self on items.",
        codeExample: ".container {\n  justify-items: center;  /* horizontal */\n  align-items: center;    /* vertical */\n}\n\n.item {\n  justify-self: start;\n  align-self: end;\n}",
      },
    ],
  });

  // CSS Grid Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: cssGrid.id,
        title: "Basic Grid Container",
        description: "Create a 3-column grid with gaps",
        language: "css",
        difficulty: "beginner",
        stage: 1,
        starterCode: "/* Create a 3-column grid with 20px gap */\n.container {\n  /* Your code here */\n}",
        testCases: JSON.stringify([
          { input: "display: grid", expected: "grid created", description: "Should create grid" },
        ]),
        hints: JSON.stringify([
          "Use display: grid",
          "Use grid-template-columns: 1fr 1fr 1fr",
          "Use gap: 20px",
        ]),
      },
      {
        conceptId: cssGrid.id,
        title: "Spanning Columns",
        description: "Make an item span 2 columns",
        language: "css",
        difficulty: "beginner",
        stage: 2,
        starterCode: "/* Make .featured span 2 columns */\n.featured {\n  /* Your code here */\n}",
        testCases: JSON.stringify([
          { input: "grid-column: span 2", expected: "spans 2 columns", description: "Should span columns" },
        ]),
        hints: JSON.stringify([
          "Use grid-column: span 2",
          "Or grid-column: 1 / 3",
        ]),
      },
      {
        conceptId: cssGrid.id,
        title: "Responsive Grid",
        description: "Create an auto-responsive grid with minimum 250px columns",
        language: "css",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "/* Create responsive grid with min 250px columns */\n.grid {\n  display: grid;\n  /* Your code here */\n}",
        testCases: JSON.stringify([
          { input: "repeat(auto-fit, minmax(250px, 1fr))", expected: "responsive", description: "Should be responsive" },
        ]),
        hints: JSON.stringify([
          "Use repeat() function",
          "Use auto-fit for responsiveness",
          "Use minmax(250px, 1fr)",
        ]),
      },
      {
        conceptId: cssGrid.id,
        title: "Grid Areas Layout",
        description: "Create a layout using grid-template-areas",
        language: "css",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "/* Create layout: header on top, sidebar + content, footer bottom */\n.container {\n  display: grid;\n  /* Your code here */\n}",
        testCases: JSON.stringify([
          { input: "grid-template-areas", expected: "named areas", description: "Should use areas" },
        ]),
        hints: JSON.stringify([
          "Use grid-template-areas with strings",
          "Define each row as a string",
          "Assign grid-area to child elements",
        ]),
      },
      {
        conceptId: cssGrid.id,
        title: "Complex Grid Layout",
        description: "Create a magazine-style grid with various column spans",
        language: "css",
        difficulty: "advanced",
        stage: 5,
        starterCode: "/* Create 4-column grid where first item spans 2x2 */\n.container {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n}\n\n.feature {\n  /* Span 2 columns and 2 rows */\n}",
        testCases: JSON.stringify([
          { input: "grid-column: span 2; grid-row: span 2", expected: "2x2 span", description: "Should span both" },
        ]),
        hints: JSON.stringify([
          "Use grid-column: span 2",
          "Use grid-row: span 2",
          "Can combine in one line: grid-area",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 10: Node.js Basics
  // ========================================
  const nodejs = await prisma.concept.create({
    data: {
      name: "Node.js Basics",
      description: "Server-side JavaScript - modules, async I/O, npm, and Express fundamentals",
      category: "Backend",
      language: "javascript",
      difficulty: 3,
    },
  });

  // Node.js Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: nodejs.id,
        type: "concept",
        front: "What is Node.js and how is it different from browser JavaScript?",
        back: "Node.js is a JavaScript runtime built on Chrome's V8 engine for server-side execution. Unlike browsers, it has no DOM/window but has file system access and networking capabilities.",
        codeExample: "// Node.js specific\nconst fs = require('fs');\nconst http = require('http');\n\n// Not available in Node:\n// document, window, localStorage",
      },
      {
        conceptId: nodejs.id,
        type: "syntax",
        front: "How do you import a module using CommonJS?",
        back: "Use require() to import modules in Node.js CommonJS format.",
        codeExample: "const fs = require('fs');\nconst express = require('express');\nconst myModule = require('./myModule');",
      },
      {
        conceptId: nodejs.id,
        type: "concept",
        front: "What is the difference between require() and import?",
        back: "require() is CommonJS (Node.js default), synchronous. import is ES6 modules, asynchronous, and requires type: 'module' in package.json.",
        codeExample: "// CommonJS\nconst fs = require('fs');\n\n// ES6 (needs type: 'module')\nimport fs from 'fs';\nimport { readFile } from 'fs';",
      },
      {
        conceptId: nodejs.id,
        type: "syntax",
        front: "How do you create a basic HTTP server in Node.js?",
        back: "Use the http module's createServer method and listen on a port.",
        codeExample: "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Hello World');\n});\n\nserver.listen(3000);",
      },
      {
        conceptId: nodejs.id,
        type: "prediction",
        front: "What will happen if you run this code?\nconst result = fs.readFileSync('data.txt', 'utf8');\nconsole.log(result);",
        back: "It will synchronously read the file and block execution until complete, then log the file contents.",
        codeExample: "// Synchronous (blocks)\nconst data = fs.readFileSync('file.txt', 'utf8');\n\n// Asynchronous (non-blocking)\nfs.readFile('file.txt', 'utf8', (err, data) => {\n  console.log(data);\n});",
      },
      {
        conceptId: nodejs.id,
        type: "bug",
        front: "Find the error:\nconst express = require('express');\nconst app = express;\napp.listen(3000);",
        back: "express should be called as a function: const app = express(); (missing parentheses)",
        codeExample: "// Fixed:\nconst express = require('express');\nconst app = express();\napp.listen(3000);",
      },
      {
        conceptId: nodejs.id,
        type: "use_case",
        front: "When should you use process.env for configuration?",
        back: "Use process.env to access environment variables for configuration (API keys, database URLs) that vary between environments.",
        codeExample: "// .env file\nPORT=3000\nDB_URL=postgres://localhost/mydb\n\n// In code\nconst port = process.env.PORT || 3000;\nconst dbUrl = process.env.DB_URL;",
      },
      {
        conceptId: nodejs.id,
        type: "concept",
        front: "What is middleware in Express.js?",
        back: "Middleware are functions that execute during the request-response cycle, with access to req, res, and next(). Used for logging, auth, parsing, etc.",
        codeExample: "app.use(express.json()); // Parse JSON bodies\n\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next(); // Pass to next middleware\n});",
      },
      {
        conceptId: nodejs.id,
        type: "syntax",
        front: "How do you handle errors in async/await with Express?",
        back: "Use try/catch blocks or create an error handling middleware.",
        codeExample: "app.get('/users', async (req, res, next) => {\n  try {\n    const users = await db.getUsers();\n    res.json(users);\n  } catch (error) {\n    next(error); // Pass to error handler\n  }\n});",
      },
      {
        conceptId: nodejs.id,
        type: "use_case",
        front: "What is the purpose of package.json?",
        back: "package.json defines project metadata, dependencies, scripts, and configuration. It's essential for npm to manage packages and project setup.",
        codeExample: "{\n  \"name\": \"my-app\",\n  \"version\": \"1.0.0\",\n  \"scripts\": {\n    \"start\": \"node index.js\",\n    \"dev\": \"nodemon index.js\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.18.0\"\n  }\n}",
      },
    ],
  });

  // Node.js Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: nodejs.id,
        title: "Basic HTTP Server",
        description: "Create a simple HTTP server that responds with 'Hello World'",
        language: "javascript",
        difficulty: "beginner",
        stage: 1,
        starterCode: "const http = require('http');\n\n// Create server and listen on port 3000\n// Your code here:",
        testCases: JSON.stringify([
          { input: "http.createServer", expected: "server created", description: "Should create server" },
        ]),
        hints: JSON.stringify([
          "Use http.createServer((req, res) => {...})",
          "Use res.end() to send response",
          "Use server.listen(3000)",
        ]),
      },
      {
        conceptId: nodejs.id,
        title: "Read File Asynchronously",
        description: "Read a file using async fs methods",
        language: "javascript",
        difficulty: "beginner",
        stage: 2,
        starterCode: "const fs = require('fs');\n\n// Read 'data.txt' asynchronously and log contents\n// Your code here:",
        testCases: JSON.stringify([
          { input: "fs.readFile", expected: "file read", description: "Should read file" },
        ]),
        hints: JSON.stringify([
          "Use fs.readFile(path, encoding, callback)",
          "Handle error in callback: (err, data) => {...}",
          "Use 'utf8' encoding",
        ]),
      },
      {
        conceptId: nodejs.id,
        title: "Express Route Handler",
        description: "Create a GET route that returns JSON",
        language: "javascript",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "const express = require('express');\nconst app = express();\n\n// Create GET /api/users that returns array of users\n// Your code here:\n\napp.listen(3000);",
        testCases: JSON.stringify([
          { input: "GET /api/users", expected: "JSON array", description: "Should return users" },
        ]),
        hints: JSON.stringify([
          "Use app.get('/api/users', (req, res) => {...})",
          "Use res.json() to send JSON response",
          "Return an array of user objects",
        ]),
      },
      {
        conceptId: nodejs.id,
        title: "Express Middleware",
        description: "Create logging middleware that runs on all requests",
        language: "javascript",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "const express = require('express');\nconst app = express();\n\n// Create middleware that logs method and URL\n// Your code here:\n\napp.get('/', (req, res) => res.send('Home'));\napp.listen(3000);",
        testCases: JSON.stringify([
          { input: "app.use", expected: "middleware runs", description: "Should log requests" },
        ]),
        hints: JSON.stringify([
          "Use app.use((req, res, next) => {...})",
          "Log req.method and req.url",
          "Call next() to continue to next handler",
        ]),
      },
      {
        conceptId: nodejs.id,
        title: "Async Error Handling",
        description: "Handle errors in async route handlers",
        language: "javascript",
        difficulty: "advanced",
        stage: 5,
        starterCode: "const express = require('express');\nconst app = express();\n\napp.get('/users/:id', async (req, res, next) => {\n  // Fetch user from database (might throw error)\n  // Add proper error handling\n  const user = await db.getUser(req.params.id);\n  res.json(user);\n});\n\napp.listen(3000);",
        testCases: JSON.stringify([
          { input: "try/catch", expected: "errors handled", description: "Should handle errors" },
        ]),
        hints: JSON.stringify([
          "Wrap async code in try/catch",
          "Call next(error) in catch block",
          "Add error handling middleware at the end",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 11: Web Security Basics
  // ========================================
  const security = await prisma.concept.create({
    data: {
      name: "Web Security Basics",
      description: "Essential security concepts - XSS, CSRF, SQL injection, authentication best practices",
      category: "Security",
      language: null,
      difficulty: 4,
    },
  });

  // Security Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: security.id,
        type: "concept",
        front: "What is Cross-Site Scripting (XSS) and how do you prevent it?",
        back: "XSS is injecting malicious scripts into web pages. Prevent by sanitizing user input, escaping output, using Content Security Policy, and frameworks that auto-escape.",
        codeExample: "// Vulnerable\ndiv.innerHTML = userInput;\n\n// Safe\ndiv.textContent = userInput;\n// or\ndiv.innerHTML = DOMPurify.sanitize(userInput);",
      },
      {
        conceptId: security.id,
        type: "concept",
        front: "What is CSRF (Cross-Site Request Forgery)?",
        back: "CSRF tricks users into executing unwanted actions on authenticated sites. Prevent with CSRF tokens, SameSite cookies, and verifying origin headers.",
        codeExample: "// Server generates token\nconst csrfToken = generateToken();\n\n// Client includes in requests\nfetch('/api/transfer', {\n  method: 'POST',\n  headers: { 'X-CSRF-Token': csrfToken },\n  body: JSON.stringify({ amount: 100 })\n});",
      },
      {
        conceptId: security.id,
        type: "bug",
        front: "Find the SQL injection vulnerability:\nconst query = `SELECT * FROM users WHERE id = ${userId}`;",
        back: "Direct string interpolation allows SQL injection. Use parameterized queries or prepared statements.",
        codeExample: "// Vulnerable\nconst query = `SELECT * FROM users WHERE id = ${userId}`;\n\n// Safe\nconst query = 'SELECT * FROM users WHERE id = ?';\ndb.query(query, [userId]);",
      },
      {
        conceptId: security.id,
        type: "use_case",
        front: "How should you store passwords in a database?",
        back: "Hash with bcrypt/argon2 (never plain text), use high cost factor, add unique salt per password (automatic in bcrypt).",
        codeExample: "const bcrypt = require('bcrypt');\n\n// Storing\nconst hash = await bcrypt.hash(password, 10);\nawait db.saveUser({ email, passwordHash: hash });\n\n// Verifying\nconst match = await bcrypt.compare(password, user.passwordHash);",
      },
      {
        conceptId: security.id,
        type: "concept",
        front: "What are the key principles of JWT security?",
        back: "Use strong secret, set expiration, validate signature, use HTTPS only, store securely (not localStorage for sensitive data), implement refresh tokens.",
        codeExample: "const jwt = require('jsonwebtoken');\n\n// Secure JWT\nconst token = jwt.sign(\n  { userId: user.id },\n  process.env.JWT_SECRET,\n  { expiresIn: '15m', algorithm: 'HS256' }\n);",
      },
      {
        conceptId: security.id,
        type: "syntax",
        front: "How do you set a secure HTTP-only cookie?",
        back: "Use httpOnly, secure (HTTPS only), sameSite flags, and appropriate maxAge.",
        codeExample: "res.cookie('token', jwtToken, {\n  httpOnly: true,  // No JS access\n  secure: true,    // HTTPS only\n  sameSite: 'strict',\n  maxAge: 900000   // 15 minutes\n});",
      },
      {
        conceptId: security.id,
        type: "concept",
        front: "What is the principle of least privilege?",
        back: "Grant users/processes only the minimum permissions needed to perform their tasks. Reduces attack surface and damage potential.",
        codeExample: "// Bad: Admin access for all\nif (user.isLoggedIn) { showAdminPanel(); }\n\n// Good: Role-based access\nif (user.role === 'admin') { showAdminPanel(); }",
      },
      {
        conceptId: security.id,
        type: "prediction",
        front: "What vulnerability exists in this code?\neval(userInput);",
        back: "Arbitrary code execution vulnerability. eval() executes any JavaScript code, allowing attackers to run malicious code.",
        codeExample: "// Never do this\neval(userInput);\n\n// Instead, use safe alternatives\nconst result = JSON.parse(userInput);\n// or Function constructor with validation",
      },
      {
        conceptId: security.id,
        type: "use_case",
        front: "When should you implement rate limiting?",
        back: "On login endpoints, API routes, password reset, to prevent brute force attacks, DDoS, and resource exhaustion.",
        codeExample: "const rateLimit = require('express-rate-limit');\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 min\n  max: 100, // limit each IP to 100 requests per windowMs\n  message: 'Too many requests'\n});\n\napp.use('/api/', limiter);",
      },
      {
        conceptId: security.id,
        type: "concept",
        front: "What is Content Security Policy (CSP)?",
        back: "HTTP header that specifies allowed sources for content, preventing XSS by restricting where scripts, styles, and other resources can load from.",
        codeExample: "// Server response header\nContent-Security-Policy: \n  default-src 'self'; \n  script-src 'self' 'unsafe-inline'; \n  style-src 'self' 'unsafe-inline';",
      },
    ],
  });

  // Security Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: security.id,
        title: "Sanitize User Input",
        description: "Prevent XSS by properly escaping user input",
        language: "javascript",
        difficulty: "beginner",
        stage: 1,
        starterCode: "// Display user's name safely (prevent XSS)\nfunction displayName(userName) {\n  const div = document.getElementById('display');\n  // Your code here - make it XSS-safe\n}",
        testCases: JSON.stringify([
          { input: "displayName('<script>alert(1)</script>')", expected: "safe display", description: "Should escape HTML" },
        ]),
        hints: JSON.stringify([
          "Use textContent instead of innerHTML",
          "Or sanitize with DOMPurify",
          "Never trust user input",
        ]),
      },
      {
        conceptId: security.id,
        title: "Hash Passwords",
        description: "Implement secure password hashing with bcrypt",
        language: "javascript",
        difficulty: "intermediate",
        stage: 2,
        starterCode: "const bcrypt = require('bcrypt');\n\n// Hash a password securely\nasync function hashPassword(password) {\n  // Your code here\n}\n\nhashPassword('mySecret123');",
        testCases: JSON.stringify([
          { input: "hashPassword('test')", expected: "hashed password", description: "Should hash password" },
        ]),
        hints: JSON.stringify([
          "Use bcrypt.hash(password, saltRounds)",
          "Use at least 10 salt rounds",
          "Returns a promise",
        ]),
      },
      {
        conceptId: security.id,
        title: "Parameterized SQL Query",
        description: "Prevent SQL injection with parameterized queries",
        language: "javascript",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "// Fetch user safely (prevent SQL injection)\nfunction getUser(userId) {\n  // BAD: const query = `SELECT * FROM users WHERE id = ${userId}`;\n  \n  // Your code here - use parameterized query\n}",
        testCases: JSON.stringify([
          { input: "getUser('1 OR 1=1')", expected: "safe query", description: "Should prevent injection" },
        ]),
        hints: JSON.stringify([
          "Use ? placeholder: 'SELECT * FROM users WHERE id = ?'",
          "Pass userId as second parameter array",
          "Never concatenate user input into SQL",
        ]),
      },
      {
        conceptId: security.id,
        title: "Secure Cookie Setup",
        description: "Set a secure HTTP-only cookie",
        language: "javascript",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "// Set a secure cookie with JWT token\nfunction setAuthCookie(res, token) {\n  // Your code here - make it secure\n}",
        testCases: JSON.stringify([
          { input: "setAuthCookie(res, token)", expected: "secure cookie", description: "Should set secure flags" },
        ]),
        hints: JSON.stringify([
          "Use res.cookie() with options",
          "Set httpOnly: true, secure: true",
          "Use sameSite: 'strict'",
        ]),
      },
      {
        conceptId: security.id,
        title: "Rate Limiting",
        description: "Implement rate limiting for API endpoints",
        language: "javascript",
        difficulty: "advanced",
        stage: 5,
        starterCode: "const express = require('express');\nconst rateLimit = require('express-rate-limit');\n\nconst app = express();\n\n// Create rate limiter: 5 requests per minute\n// Your code here\n\napp.get('/api/data', (req, res) => {\n  res.json({ data: 'sensitive' });\n});",
        testCases: JSON.stringify([
          { input: "6 requests in 1 minute", expected: "rate limit error", description: "Should block excess requests" },
        ]),
        hints: JSON.stringify([
          "Use rateLimit({ windowMs, max })",
          "windowMs: 60 * 1000 for 1 minute",
          "max: 5 for 5 requests",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 12: Testing with Jest
  // ========================================
  const testing = await prisma.concept.create({
    data: {
      name: "Testing with Jest",
      description: "Unit testing fundamentals - describe, test, expect, mocking, and test-driven development",
      category: "Testing",
      language: "javascript",
      difficulty: 3,
    },
  });

  // Testing Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: testing.id,
        type: "syntax",
        front: "How do you write a basic Jest test?",
        back: "Use test() or it() with description and callback. Use expect() for assertions.",
        codeExample: "test('adds 1 + 2 to equal 3', () => {\n  expect(1 + 2).toBe(3);\n});\n\n// or\nit('adds numbers', () => {\n  expect(add(1, 2)).toBe(3);\n});",
      },
      {
        conceptId: testing.id,
        type: "concept",
        front: "What's the difference between toBe() and toEqual()?",
        back: "toBe() uses === (reference equality). toEqual() does deep comparison (value equality). Use toEqual() for objects/arrays.",
        codeExample: "// toBe for primitives\nexpect(5).toBe(5);\n\n// toEqual for objects\nexpect({ a: 1 }).toEqual({ a: 1 });\nexpect([1, 2]).toEqual([1, 2]);",
      },
      {
        conceptId: testing.id,
        type: "syntax",
        front: "How do you organize tests with describe blocks?",
        back: "Use describe() to group related tests. Can be nested for better organization.",
        codeExample: "describe('Calculator', () => {\n  describe('add', () => {\n    test('adds positive numbers', () => {\n      expect(add(2, 3)).toBe(5);\n    });\n  });\n  \n  describe('subtract', () => {\n    test('subtracts numbers', () => {\n      expect(subtract(5, 2)).toBe(3);\n    });\n  });\n});",
      },
      {
        conceptId: testing.id,
        type: "use_case",
        front: "When should you use beforeEach() and afterEach()?",
        back: "Use beforeEach() to set up test data/state before each test. Use afterEach() to clean up after each test.",
        codeExample: "describe('Database', () => {\n  let db;\n  \n  beforeEach(() => {\n    db = createTestDB();\n  });\n  \n  afterEach(() => {\n    db.cleanup();\n  });\n  \n  test('inserts user', () => {\n    db.insert({ name: 'Alice' });\n    expect(db.count()).toBe(1);\n  });\n});",
      },
      {
        conceptId: testing.id,
        type: "syntax",
        front: "How do you test async code in Jest?",
        back: "Return a promise, use async/await, or use the done callback.",
        codeExample: "// async/await (preferred)\ntest('fetches data', async () => {\n  const data = await fetchData();\n  expect(data).toEqual({ id: 1 });\n});\n\n// return promise\ntest('fetches data', () => {\n  return fetchData().then(data => {\n    expect(data).toEqual({ id: 1 });\n  });\n});",
      },
      {
        conceptId: testing.id,
        type: "concept",
        front: "What is mocking and why is it useful?",
        back: "Mocking replaces real implementations with fake ones for testing. Isolates code, controls dependencies, and speeds up tests.",
        codeExample: "// Mock a function\nconst mockFn = jest.fn();\nmockFn.mockReturnValue(42);\n\n// Mock a module\njest.mock('./api');\nconst api = require('./api');\napi.fetchUser.mockResolvedValue({ id: 1 });",
      },
      {
        conceptId: testing.id,
        type: "syntax",
        front: "How do you spy on a function with Jest?",
        back: "Use jest.spyOn() to watch function calls without replacing implementation.",
        codeExample: "const obj = {\n  getValue: () => 42\n};\n\nconst spy = jest.spyOn(obj, 'getValue');\nobj.getValue();\n\nexpect(spy).toHaveBeenCalled();\nexpect(spy).toHaveBeenCalledTimes(1);",
      },
      {
        conceptId: testing.id,
        type: "prediction",
        front: "Will this test pass?\ntest('array contains 2', () => {\n  expect([1, 2, 3]).toContain(2);\n});",
        back: "Yes. toContain() checks if an array/string includes a value.",
        codeExample: "expect([1, 2, 3]).toContain(2); // ✓ pass\nexpect('hello').toContain('ell'); // ✓ pass\nexpect([1, 2, 3]).toContain(4); // ✗ fail",
      },
      {
        conceptId: testing.id,
        type: "bug",
        front: "Why does this async test pass incorrectly?\ntest('fetches data', () => {\n  fetchData().then(data => {\n    expect(data).toBe(null);\n  });\n});",
        back: "Missing return or await. Test completes before promise resolves, so assertion never runs.",
        codeExample: "// Fixed:\ntest('fetches data', async () => {\n  const data = await fetchData();\n  expect(data).toBe(null);\n});\n// or\ntest('fetches data', () => {\n  return fetchData().then(...);\n});",
      },
      {
        conceptId: testing.id,
        type: "use_case",
        front: "What is Test-Driven Development (TDD)?",
        back: "Write failing tests first, then implement code to pass them. Cycle: Red (fail) → Green (pass) → Refactor.",
        codeExample: "// 1. Write test first (RED)\ntest('multiply', () => {\n  expect(multiply(2, 3)).toBe(6);\n});\n\n// 2. Implement (GREEN)\nfunction multiply(a, b) {\n  return a * b;\n}\n\n// 3. Refactor if needed",
      },
    ],
  });

  // Testing Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: testing.id,
        title: "First Jest Test",
        description: "Write a basic test for a sum function",
        language: "javascript",
        difficulty: "beginner",
        stage: 1,
        starterCode: "function sum(a, b) {\n  return a + b;\n}\n\n// Write a test that sum(2, 3) equals 5\n// Your code here:",
        testCases: JSON.stringify([
          { input: "test('sum')", expected: "test passes", description: "Should test sum function" },
        ]),
        hints: JSON.stringify([
          "Use test('description', () => {...})",
          "Use expect(sum(2, 3)).toBe(5)",
          "Remember to call the function",
        ]),
      },
      {
        conceptId: testing.id,
        title: "Test Object Equality",
        description: "Test that a function returns the correct object",
        language: "javascript",
        difficulty: "beginner",
        stage: 2,
        starterCode: "function getUser() {\n  return { id: 1, name: 'Alice' };\n}\n\n// Test that getUser returns correct object\n// Your code here:",
        testCases: JSON.stringify([
          { input: "test object", expected: "passes", description: "Should use toEqual" },
        ]),
        hints: JSON.stringify([
          "Use toEqual() not toBe() for objects",
          "expect(getUser()).toEqual({ id: 1, name: 'Alice' })",
        ]),
      },
      {
        conceptId: testing.id,
        title: "Test Async Function",
        description: "Test a function that returns a promise",
        language: "javascript",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "async function fetchUser(id) {\n  return { id, name: 'Alice' };\n}\n\n// Test async function\n// Your code here:",
        testCases: JSON.stringify([
          { input: "async test", expected: "passes", description: "Should handle async" },
        ]),
        hints: JSON.stringify([
          "Use async/await in test",
          "test('name', async () => {...})",
          "const result = await fetchUser(1)",
        ]),
      },
      {
        conceptId: testing.id,
        title: "Mock a Function",
        description: "Create and test a mock function",
        language: "javascript",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "// Create a mock function that returns 'mocked!'\n// Call it and verify it was called\n// Your code here:",
        testCases: JSON.stringify([
          { input: "jest.fn()", expected: "mock tested", description: "Should create and test mock" },
        ]),
        hints: JSON.stringify([
          "const mockFn = jest.fn()",
          "mockFn.mockReturnValue('mocked!')",
          "expect(mockFn).toHaveBeenCalled()",
        ]),
      },
      {
        conceptId: testing.id,
        title: "Test with Setup",
        description: "Use beforeEach to set up test data",
        language: "javascript",
        difficulty: "advanced",
        stage: 5,
        starterCode: "class Counter {\n  constructor() { this.count = 0; }\n  increment() { this.count++; }\n  getCount() { return this.count; }\n}\n\n// Use beforeEach to create fresh counter for each test\ndescribe('Counter', () => {\n  // Your code here\n});",
        testCases: JSON.stringify([
          { input: "beforeEach", expected: "setup working", description: "Should use beforeEach" },
        ]),
        hints: JSON.stringify([
          "let counter; beforeEach(() => { counter = new Counter(); })",
          "Write multiple tests using the counter",
          "Each test gets a fresh instance",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 13: Regular Expressions
  // ========================================
  const regex = await prisma.concept.create({
    data: {
      name: "Regular Expressions",
      description: "Pattern matching - regex syntax, character classes, quantifiers, groups, and common patterns",
      category: "Programming Fundamentals",
      language: null,
      difficulty: 3,
    },
  });

  // Regex Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: regex.id,
        type: "syntax",
        front: "How do you create a regex pattern in JavaScript?",
        back: "Use /pattern/flags literal or new RegExp('pattern', 'flags').",
        codeExample: "// Literal\nconst regex = /hello/i;\n\n// Constructor\nconst regex2 = new RegExp('hello', 'i');\n\n// Test\nregex.test('Hello World'); // true",
      },
      {
        conceptId: regex.id,
        type: "concept",
        front: "What do the common regex flags (g, i, m) mean?",
        back: "g = global (all matches), i = case-insensitive, m = multiline (^ and $ match line boundaries).",
        codeExample: "const text = 'Hello hello HELLO';\n\n/hello/.test(text);      // true (first)\n/hello/g.test(text);     // true (all)\n/hello/i.test(text);     // true (case-insensitive)\n/hello/gi.exec(text);    // all case-insensitive",
      },
      {
        conceptId: regex.id,
        type: "syntax",
        front: "What do \\d, \\w, and \\s represent in regex?",
        back: "\\d = digit [0-9], \\w = word character [a-zA-Z0-9_], \\s = whitespace (space, tab, newline).",
        codeExample: "/\\d+/.test('123');     // true (digits)\n/\\w+/.test('hello_1'); // true (word chars)\n/\\s+/.test('  ');      // true (whitespace)\n\n// Negations: \\D \\W \\S (non-digit, non-word, non-space)",
      },
      {
        conceptId: regex.id,
        type: "concept",
        front: "What do the quantifiers *, +, ?, and {n,m} mean?",
        back: "* = 0 or more, + = 1 or more, ? = 0 or 1, {n,m} = between n and m times.",
        codeExample: "/a*/.test('');    // true (0 or more)\n/a+/.test('aaa'); // true (1 or more)\n/a?/.test('a');   // true (0 or 1)\n/a{2,4}/.test('aaa'); // true (2-4 times)",
      },
      {
        conceptId: regex.id,
        type: "use_case",
        front: "How do you validate an email address with regex?",
        back: "Use pattern matching for name@domain.extension format.",
        codeExample: "const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n\nemailRegex.test('user@example.com'); // true\nemailRegex.test('invalid.email');    // false\nemailRegex.test('no@domain');        // false",
      },
      {
        conceptId: regex.id,
        type: "syntax",
        front: "How do you capture groups in regex?",
        back: "Use parentheses () to create capture groups. Access with match() or replace().",
        codeExample: "const regex = /(\\d{3})-(\\d{3})-(\\d{4})/;\nconst phone = '555-123-4567';\n\nconst match = phone.match(regex);\nconsole.log(match[1]); // '555'\nconsole.log(match[2]); // '123'\nconsole.log(match[3]); // '4567'",
      },
      {
        conceptId: regex.id,
        type: "prediction",
        front: "What will this match?\n/^[a-z]+$/i.test('Hello')",
        back: "true. ^ = start, [a-z]+ = one or more letters, $ = end, i = case-insensitive.",
        codeExample: "/^[a-z]+$/i.test('Hello');  // true\n/^[a-z]+$/i.test('Hello!'); // false (! not allowed)\n/^[a-z]+$/i.test('Hello World'); // false (space)",
      },
      {
        conceptId: regex.id,
        type: "bug",
        front: "Why doesn't this work as expected?\nconst regex = /^test/g;\nregex.test('test'); // true\nregex.test('test'); // false",
        back: "The g flag maintains state (lastIndex). It continues from last position. Remove g for simple tests or reset lastIndex.",
        codeExample: "// Problem\nconst regex = /^test/g;\nregex.test('test'); // true (starts at 0)\nregex.test('test'); // false (starts at 4)\n\n// Fix: remove g\nconst regex2 = /^test/;\nregex2.test('test'); // always true",
      },
      {
        conceptId: regex.id,
        type: "use_case",
        front: "How do you replace text using regex?",
        back: "Use string.replace(regex, replacement). Can use $1, $2 for capture groups.",
        codeExample: "// Simple replace\n'hello world'.replace(/world/, 'there'); // 'hello there'\n\n// With groups\nconst date = '2024-01-15';\ndate.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, '$2/$3/$1');\n// '01/15/2024'",
      },
      {
        conceptId: regex.id,
        type: "syntax",
        front: "What do the anchors ^ and $ do?",
        back: "^ matches start of string/line, $ matches end of string/line.",
        codeExample: "/^hello/.test('hello world');  // true (starts with)\n/world$/.test('hello world');  // true (ends with)\n/^hello$/.test('hello');       // true (exact match)\n/^hello$/.test('hello world'); // false",
      },
    ],
  });

  // Regex Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: regex.id,
        title: "Match Digits",
        description: "Create a regex that matches one or more digits",
        language: "javascript",
        difficulty: "beginner",
        stage: 1,
        starterCode: "// Create regex that matches numbers\nconst regex = // Your code here\n\nconsole.log(regex.test('123'));   // should be true\nconsole.log(regex.test('abc'));   // should be false",
        testCases: JSON.stringify([
          { input: "regex.test('123')", expected: "true", description: "Should match digits" },
        ]),
        hints: JSON.stringify([
          "Use \\d for digits",
          "Use + for one or more",
          "Pattern: /\\d+/",
        ]),
      },
      {
        conceptId: regex.id,
        title: "Validate Email",
        description: "Create a regex to validate email addresses",
        language: "javascript",
        difficulty: "intermediate",
        stage: 2,
        starterCode: "// Validate email format: name@domain.ext\nconst emailRegex = // Your code here\n\nconsole.log(emailRegex.test('user@example.com')); // true\nconsole.log(emailRegex.test('invalid'));          // false",
        testCases: JSON.stringify([
          { input: "emailRegex.test('user@example.com')", expected: "true", description: "Should validate email" },
        ]),
        hints: JSON.stringify([
          "Pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
          "^ and $ for exact match",
          "[^\\s@]+ means no spaces or @",
        ]),
      },
      {
        conceptId: regex.id,
        title: "Extract Phone Number",
        description: "Extract phone number parts using capture groups",
        language: "javascript",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "// Extract area code, prefix, and number from '555-123-4567'\nconst phone = '555-123-4567';\nconst regex = // Your code here\n\nconst match = phone.match(regex);\nconsole.log(match[1]); // should be '555'",
        testCases: JSON.stringify([
          { input: "match[1] === '555'", expected: "true", description: "Should extract area code" },
        ]),
        hints: JSON.stringify([
          "Use (\\d{3}) for capture groups",
          "Pattern: /(\\d{3})-(\\d{3})-(\\d{4})/",
          "Access groups with match[1], match[2], etc.",
        ]),
      },
      {
        conceptId: regex.id,
        title: "Replace Date Format",
        description: "Convert date from YYYY-MM-DD to MM/DD/YYYY",
        language: "javascript",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "// Convert '2024-01-15' to '01/15/2024'\nconst date = '2024-01-15';\n// Your code here",
        testCases: JSON.stringify([
          { input: "converted date", expected: "'01/15/2024'", description: "Should reformat date" },
        ]),
        hints: JSON.stringify([
          "Use capture groups: (\\d{4})-(\\d{2})-(\\d{2})",
          "Replace with '$2/$3/$1'",
          "date.replace(regex, '$2/$3/$1')",
        ]),
      },
      {
        conceptId: regex.id,
        title: "Password Validation",
        description: "Validate strong password: 8+ chars, uppercase, lowercase, digit",
        language: "javascript",
        difficulty: "advanced",
        stage: 5,
        starterCode: "// Password must have:\n// - At least 8 characters\n// - One uppercase letter\n// - One lowercase letter\n// - One digit\nconst passwordRegex = // Your code here",
        testCases: JSON.stringify([
          { input: "passwordRegex.test('Password1')", expected: "true", description: "Should validate strong password" },
        ]),
        hints: JSON.stringify([
          "Use lookaheads: (?=.*[A-Z])",
          "(?=.*[a-z])(?=.*\\d).{8,}",
          "Combine multiple conditions",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 14: Docker Basics
  // ========================================
  const docker = await prisma.concept.create({
    data: {
      name: "Docker Basics",
      description: "Containerization fundamentals - images, containers, Dockerfile, docker-compose",
      category: "DevOps",
      language: null,
      difficulty: 4,
    },
  });

  // Docker Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: docker.id,
        type: "concept",
        front: "What is Docker and why is it useful?",
        back: "Docker packages applications and dependencies into containers - isolated, portable environments that run consistently anywhere.",
        codeExample: "// Benefits:\n// - Consistency across dev/staging/prod\n// - Isolation (no dependency conflicts)\n// - Portability (runs anywhere)\n// - Fast deployment\n// - Resource efficient",
      },
      {
        conceptId: docker.id,
        type: "concept",
        front: "What's the difference between a Docker image and a container?",
        back: "Image is a read-only template (blueprint). Container is a running instance of an image (active process).",
        codeExample: "# Image = Class, Container = Object\n\n# Pull image (download template)\ndocker pull node:18\n\n# Run container (create instance)\ndocker run -d node:18",
      },
      {
        conceptId: docker.id,
        type: "syntax",
        front: "How do you create a basic Dockerfile?",
        back: "Start with FROM base image, add instructions: WORKDIR, COPY, RUN, CMD.",
        codeExample: "# Dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]",
      },
      {
        conceptId: docker.id,
        type: "syntax",
        front: "What are the essential Docker CLI commands?",
        back: "docker build, run, ps, stop, rm (containers), rmi (images), logs, exec.",
        codeExample: "docker build -t myapp .        # Build image\ndocker run -p 3000:3000 myapp  # Run container\ndocker ps                      # List running\ndocker stop <id>               # Stop container\ndocker logs <id>               # View logs\ndocker exec -it <id> sh        # Enter container",
      },
      {
        conceptId: docker.id,
        type: "use_case",
        front: "How do you persist data in Docker?",
        back: "Use volumes to store data outside containers, surviving container deletion.",
        codeExample: "# Named volume\ndocker run -v mydata:/app/data myapp\n\n# Bind mount (link host directory)\ndocker run -v $(pwd):/app myapp\n\n# List volumes\ndocker volume ls",
      },
      {
        conceptId: docker.id,
        type: "concept",
        front: "What is docker-compose used for?",
        back: "Defines and runs multi-container applications using YAML config. Simplifies complex setups.",
        codeExample: "# docker-compose.yml\nversion: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n  db:\n    image: postgres:14\n    environment:\n      POSTGRES_PASSWORD: secret",
      },
      {
        conceptId: docker.id,
        type: "syntax",
        front: "How do you run containers in detached mode?",
        back: "Use -d flag to run in background. Use --name to give it a name.",
        codeExample: "# Detached mode\ndocker run -d --name myapp -p 3000:3000 node-app\n\n# Attached mode (see logs)\ndocker run -p 3000:3000 node-app\n\n# Attach to running container\ndocker attach myapp",
      },
      {
        conceptId: docker.id,
        type: "bug",
        front: "Why can't I access my app at localhost:3000?\ndocker run myapp",
        back: "Missing port mapping. Use -p host:container to expose ports.",
        codeExample: "# Wrong\ndocker run myapp\n\n# Correct\ndocker run -p 3000:3000 myapp\n# -p maps host port 3000 to container port 3000",
      },
      {
        conceptId: docker.id,
        type: "prediction",
        front: "What happens when you run docker-compose up?",
        back: "Builds images (if needed), creates and starts all defined services, creates networks and volumes.",
        codeExample: "docker-compose up     # Start all services\ndocker-compose up -d  # Detached mode\ndocker-compose down   # Stop and remove all\ndocker-compose logs   # View logs",
      },
      {
        conceptId: docker.id,
        type: "use_case",
        front: "What is a .dockerignore file?",
        back: "Specifies files/folders to exclude from Docker build context. Like .gitignore for Docker.",
        codeExample: "# .dockerignore\nnode_modules\n.git\n.env\n*.log\nREADME.md\n.vscode",
      },
    ],
  });

  // Docker Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: docker.id,
        title: "Basic Dockerfile",
        description: "Create a Dockerfile for a Node.js application",
        language: "dockerfile",
        difficulty: "beginner",
        stage: 1,
        starterCode: "# Create Dockerfile for Node.js app\n# Your code here\n\n# Should:\n# - Use node:18-alpine base\n# - Set working directory to /app\n# - Copy package files and install\n# - Copy source code\n# - Expose port 3000\n# - Start with npm start",
        testCases: JSON.stringify([
          { input: "FROM node:18-alpine", expected: "valid dockerfile", description: "Should use base image" },
        ]),
        hints: JSON.stringify([
          "Start with FROM node:18-alpine",
          "WORKDIR /app",
          "COPY package*.json ./",
          "RUN npm install",
          "CMD [\"npm\", \"start\"]",
        ]),
      },
      {
        conceptId: docker.id,
        title: "Build and Run",
        description: "Build an image and run a container with port mapping",
        language: "bash",
        difficulty: "beginner",
        stage: 2,
        starterCode: "# Build image named 'myapp' from current directory\n# Your code here\n\n# Run container with port 3000 mapped\n# Your code here",
        testCases: JSON.stringify([
          { input: "docker build -t myapp .", expected: "image built", description: "Should build image" },
        ]),
        hints: JSON.stringify([
          "docker build -t myapp .",
          "docker run -p 3000:3000 myapp",
          "-t tags the image with a name",
        ]),
      },
      {
        conceptId: docker.id,
        title: "Docker Compose Setup",
        description: "Create docker-compose.yml for web app + database",
        language: "yaml",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "# Create docker-compose.yml\n# Services: web (build: .) and postgres database\n# Your code here",
        testCases: JSON.stringify([
          { input: "version: '3.8'", expected: "valid compose file", description: "Should define services" },
        ]),
        hints: JSON.stringify([
          "version: '3.8'",
          "services: web: build: . ports: ...",
          "db: image: postgres:14",
        ]),
      },
      {
        conceptId: docker.id,
        title: "Volume Mounting",
        description: "Run container with volume for data persistence",
        language: "bash",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "# Run postgres container with volume 'pgdata'\n# Map port 5432\n# Your code here",
        testCases: JSON.stringify([
          { input: "docker run -v", expected: "volume mounted", description: "Should mount volume" },
        ]),
        hints: JSON.stringify([
          "docker run -d -p 5432:5432",
          "-v pgdata:/var/lib/postgresql/data",
          "postgres:14",
        ]),
      },
      {
        conceptId: docker.id,
        title: "Multi-stage Build",
        description: "Create optimized Dockerfile with multi-stage build",
        language: "dockerfile",
        difficulty: "advanced",
        stage: 5,
        starterCode: "# Multi-stage Dockerfile\n# Stage 1: Build (install all dependencies)\n# Stage 2: Production (only runtime dependencies)\n# Your code here",
        testCases: JSON.stringify([
          { input: "FROM node AS builder", expected: "multi-stage", description: "Should have multiple stages" },
        ]),
        hints: JSON.stringify([
          "FROM node:18 AS builder",
          "FROM node:18-alpine AS production",
          "COPY --from=builder /app/dist ./dist",
        ]),
      },
    ],
  });

  // ========================================
  // CONCEPT 15: GraphQL Fundamentals
  // ========================================
  const graphql = await prisma.concept.create({
    data: {
      name: "GraphQL Fundamentals",
      description: "Modern API design - queries, mutations, schemas, resolvers, and GraphQL vs REST",
      category: "API Design",
      language: null,
      difficulty: 4,
    },
  });

  // GraphQL Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        conceptId: graphql.id,
        type: "concept",
        front: "What is GraphQL and how does it differ from REST?",
        back: "GraphQL is a query language for APIs. Unlike REST's multiple endpoints, GraphQL has one endpoint where clients specify exactly what data they need.",
        codeExample: "// REST: Multiple endpoints\nGET /api/users/1\nGET /api/users/1/posts\nGET /api/users/1/friends\n\n// GraphQL: Single endpoint, specific query\nquery {\n  user(id: 1) {\n    name\n    posts { title }\n    friends { name }\n  }\n}",
      },
      {
        conceptId: graphql.id,
        type: "syntax",
        front: "How do you define a GraphQL schema?",
        back: "Use type definitions with fields and types. Define Query for reads and Mutation for writes.",
        codeExample: "type User {\n  id: ID!\n  name: String!\n  email: String!\n  posts: [Post!]!\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  author: User!\n}\n\ntype Query {\n  user(id: ID!): User\n  users: [User!]!\n}",
      },
      {
        conceptId: graphql.id,
        type: "syntax",
        front: "How do you write a basic GraphQL query?",
        back: "Use query keyword, specify fields you want. Can nest related data.",
        codeExample: "query GetUser {\n  user(id: \"1\") {\n    id\n    name\n    email\n    posts {\n      title\n      createdAt\n    }\n  }\n}",
      },
      {
        conceptId: graphql.id,
        type: "concept",
        front: "What is a resolver in GraphQL?",
        back: "Functions that fetch data for each field. Resolvers connect schema to data sources.",
        codeExample: "const resolvers = {\n  Query: {\n    user: (parent, { id }, context) => {\n      return db.users.find(u => u.id === id);\n    },\n    users: () => db.users.all()\n  },\n  User: {\n    posts: (user) => db.posts.byAuthor(user.id)\n  }\n};",
      },
      {
        conceptId: graphql.id,
        type: "syntax",
        front: "How do you define a mutation in GraphQL?",
        back: "Define Mutation type in schema, create resolver that modifies data.",
        codeExample: "# Schema\ntype Mutation {\n  createUser(name: String!, email: String!): User!\n}\n\n# Resolver\nMutation: {\n  createUser: (_, { name, email }) => {\n    const user = { id: uuid(), name, email };\n    db.users.save(user);\n    return user;\n  }\n}",
      },
      {
        conceptId: graphql.id,
        type: "use_case",
        front: "What are the advantages of GraphQL over REST?",
        back: "No over/under-fetching, single request for multiple resources, strong typing, introspection, real-time with subscriptions.",
        codeExample: "// REST: Over-fetching\nGET /api/users/1 // returns ALL fields\n\n// GraphQL: Exact data needed\nquery {\n  user(id: 1) {\n    name  // Only name\n  }\n}\n\n// REST: Multiple requests\nGET /users/1\nGET /users/1/posts\n\n// GraphQL: Single request\nquery {\n  user(id: 1) { name posts { title } }\n}",
      },
      {
        conceptId: graphql.id,
        type: "concept",
        front: "What are GraphQL variables?",
        back: "Dynamic values passed separately from query. Makes queries reusable with different inputs.",
        codeExample: "# Query with variable\nquery GetUser($userId: ID!) {\n  user(id: $userId) {\n    name\n    email\n  }\n}\n\n# Variables (sent separately)\n{\n  \"userId\": \"1\"\n}",
      },
      {
        conceptId: graphql.id,
        type: "prediction",
        front: "What will this query return?\nquery {\n  user(id: \"1\") {\n    name\n  }\n}",
        back: "An object with user field containing only the name field: { data: { user: { name: 'Alice' } } }",
        codeExample: "// Query asks for only name\nquery {\n  user(id: \"1\") {\n    name\n  }\n}\n\n// Response contains only name\n{\n  \"data\": {\n    \"user\": {\n      \"name\": \"Alice\"\n    }\n  }\n}",
      },
      {
        conceptId: graphql.id,
        type: "bug",
        front: "Find the error:\ntype Query {\n  user(id: ID): User\n}",
        back: "ID should be non-nullable (ID!) if it's required parameter. Otherwise function might be called without id.",
        codeExample: "// Wrong: id is optional\ntype Query {\n  user(id: ID): User\n}\n\n// Correct: id is required\ntype Query {\n  user(id: ID!): User\n}",
      },
      {
        conceptId: graphql.id,
        type: "use_case",
        front: "What are fragments in GraphQL?",
        back: "Reusable pieces of query logic. Define once, use multiple times.",
        codeExample: "fragment UserInfo on User {\n  id\n  name\n  email\n}\n\nquery {\n  user(id: \"1\") {\n    ...UserInfo\n    posts { title }\n  }\n  author(id: \"2\") {\n    ...UserInfo\n  }\n}",
      },
    ],
  });

  // GraphQL Challenges
  await prisma.challenge.createMany({
    data: [
      {
        conceptId: graphql.id,
        title: "Basic Schema",
        description: "Define a GraphQL schema for a blog",
        language: "graphql",
        difficulty: "beginner",
        stage: 1,
        starterCode: "# Define types for User and Post\n# User has: id, name, email\n# Post has: id, title, content, author (User)\n# Your code here:",
        testCases: JSON.stringify([
          { input: "type User", expected: "valid schema", description: "Should define types" },
        ]),
        hints: JSON.stringify([
          "type User { id: ID! name: String! ... }",
          "type Post { id: ID! title: String! ... }",
          "Use ! for required fields",
        ]),
      },
      {
        conceptId: graphql.id,
        title: "Write a Query",
        description: "Write a query to fetch user with their posts",
        language: "graphql",
        difficulty: "beginner",
        stage: 2,
        starterCode: "# Write query to get user by id with their posts\n# Get: id, name, posts (title and createdAt)\n# Your code here:",
        testCases: JSON.stringify([
          { input: "query { user(id:...) }", expected: "valid query", description: "Should fetch nested data" },
        ]),
        hints: JSON.stringify([
          "query { user(id: \"1\") { ... } }",
          "Nest posts inside user",
          "Specify fields for each level",
        ]),
      },
      {
        conceptId: graphql.id,
        title: "Create Mutation",
        description: "Define a mutation to create a post",
        language: "graphql",
        difficulty: "intermediate",
        stage: 3,
        starterCode: "# Define mutation: createPost(title, content, authorId)\n# Returns the created Post\n# Your code here:",
        testCases: JSON.stringify([
          { input: "type Mutation", expected: "mutation defined", description: "Should define mutation" },
        ]),
        hints: JSON.stringify([
          "type Mutation { createPost(...): Post! }",
          "Parameters: title: String!, content: String!, authorId: ID!",
          "Return type is Post!",
        ]),
      },
      {
        conceptId: graphql.id,
        title: "Resolver Function",
        description: "Write a resolver for the user query",
        language: "javascript",
        difficulty: "intermediate",
        stage: 4,
        starterCode: "// Write resolver that fetches user by id\nconst resolvers = {\n  Query: {\n    user: (parent, { id }, context) => {\n      // Your code here\n    }\n  }\n};",
        testCases: JSON.stringify([
          { input: "user resolver", expected: "returns user", description: "Should fetch user" },
        ]),
        hints: JSON.stringify([
          "Access database via context.db",
          "Use id parameter from args",
          "Return user object or null",
        ]),
      },
      {
        conceptId: graphql.id,
        title: "Query with Variables",
        description: "Write a query using variables for dynamic input",
        language: "graphql",
        difficulty: "advanced",
        stage: 5,
        starterCode: "# Write query with variable for userId\n# Define variable type and use in query\n# Your code here:",
        testCases: JSON.stringify([
          { input: "query Name($var: Type)", expected: "query with variable", description: "Should use variables" },
        ]),
        hints: JSON.stringify([
          "query GetUser($userId: ID!) { ... }",
          "Use $userId in the query",
          "Variables defined in parentheses",
        ]),
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`  - 15 concepts created`);
  console.log(`  - 150 flashcards created (10 per concept)`);
  console.log(`  - 75 challenges created (5 per concept)`);
  console.log("\n📚 Concepts included:");
  console.log("  1. JavaScript Promises");
  console.log("  2. React Hooks");
  console.log("  3. CSS Flexbox");
  console.log("  4. Python Async/Await");
  console.log("  5. TypeScript Fundamentals");
  console.log("  6. SQL Basics");
  console.log("  7. Git & Version Control");
  console.log("  8. HTTP & REST APIs");
  console.log("  9. CSS Grid Layout");
  console.log("  10. Node.js Basics");
  console.log("  11. Web Security Basics ⭐ NEW");
  console.log("  12. Testing with Jest ⭐ NEW");
  console.log("  13. Regular Expressions ⭐ NEW");
  console.log("  14. Docker Basics ⭐ NEW");
  console.log("  15. GraphQL Fundamentals ⭐ NEW");
  console.log("\n🎯 Categories:");
  console.log("  - Frontend: React, CSS (Flexbox, Grid)");
  console.log("  - Backend: Node.js, HTTP/REST, GraphQL");
  console.log("  - Languages: JavaScript, TypeScript, Python");
  console.log("  - Databases: SQL");
  console.log("  - DevOps: Docker, Git");
  console.log("  - Testing: Jest");
  console.log("  - Security: Web Security");
  console.log("  - Fundamentals: Promises, Regex");
  console.log("\n🚀 Next steps:");
  console.log("  1. Run: npm run dev");
  console.log("  2. Visit http://localhost:3000");
  console.log("  3. Start learning (guest mode or sign in with GitHub)!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
