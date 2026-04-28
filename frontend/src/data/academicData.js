// ─────────────────────────────────────────────────────────────
// Academic MCQ Data — 5 subjects × 10 questions each
// ─────────────────────────────────────────────────────────────

export const SUBJECTS = [
  { id: "os",   label: "Operating Systems",           color: "indigo",  icon: "cpu" },
  { id: "dbms", label: "Database Systems",            color: "emerald", icon: "database" },
  { id: "oops", label: "OOP Concepts",                color: "violet",  icon: "layers" },
  { id: "cn",   label: "Computer Networks",           color: "rose",    icon: "network" },
  { id: "dsa",  label: "Data Structures & Algorithms", color: "amber",   icon: "git-branch" },
];

export const QUESTIONS = [
  // ═══════════════════════════════════════════════════════════
  //  OPERATING SYSTEMS  (os)
  // ═══════════════════════════════════════════════════════════
  {
    id: "os-1",
    subject: "os",
    question: "Which scheduling algorithm is known as the 'convoy effect'?",
    options: [
      "Shortest Job First (SJF)",
      "First Come First Serve (FCFS)",
      "Round Robin (RR)",
      "Priority Scheduling",
    ],
    correctAnswer: 1,
    explanation:
      "In FCFS, a long CPU-burst process can hold the CPU while many shorter processes wait behind it, causing the convoy effect.",
  },
  {
    id: "os-2",
    subject: "os",
    question: "What is a 'zombie process'?",
    options: [
      "A process that is waiting for I/O",
      "A process that has finished execution but still has an entry in the process table",
      "A process that is blocked indefinitely",
      "A process running in the background",
    ],
    correctAnswer: 1,
    explanation:
      "A zombie process has completed execution but its parent hasn't read its exit status yet, so its process table entry remains.",
  },
  {
    id: "os-3",
    subject: "os",
    question: "Which of the following is NOT a necessary condition for deadlock?",
    options: [
      "Mutual Exclusion",
      "Hold and Wait",
      "Preemption",
      "Circular Wait",
    ],
    correctAnswer: 2,
    explanation:
      "The four necessary conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemption (allowing resource to be taken away) actually prevents deadlock.",
  },
  {
    id: "os-4",
    subject: "os",
    question: "In virtual memory, what does a page fault cause?",
    options: [
      "The program terminates immediately",
      "The CPU switches to kernel mode to load the required page from disk",
      "The page is deleted from memory",
      "A new process is created",
    ],
    correctAnswer: 1,
    explanation:
      "A page fault triggers a trap to the OS, which loads the required page from secondary storage into main memory.",
  },
  {
    id: "os-5",
    subject: "os",
    question: "What is the primary purpose of a semaphore in OS?",
    options: [
      "Memory allocation",
      "Process synchronization and mutual exclusion",
      "Disk scheduling",
      "File management",
    ],
    correctAnswer: 1,
    explanation:
      "Semaphores are synchronization tools that use wait (P) and signal (V) operations to control access to shared resources.",
  },
  {
    id: "os-6",
    subject: "os",
    question: "Which page replacement algorithm suffers from Bélády's anomaly?",
    options: [
      "Optimal Page Replacement",
      "LRU (Least Recently Used)",
      "FIFO (First In First Out)",
      "LFU (Least Frequently Used)",
    ],
    correctAnswer: 2,
    explanation:
      "FIFO can exhibit Bélády's anomaly — increasing the number of page frames can sometimes increase the number of page faults.",
  },
  {
    id: "os-7",
    subject: "os",
    question: "What distinguishes a thread from a process?",
    options: [
      "Threads have their own address space",
      "Threads share the address space of their parent process",
      "Threads cannot run concurrently",
      "Threads are always slower than processes",
    ],
    correctAnswer: 1,
    explanation:
      "Threads within the same process share code, data, and heap segments but have their own stack and register set.",
  },
  {
    id: "os-8",
    subject: "os",
    question: "Which disk scheduling algorithm provides the minimum seek time on average?",
    options: [
      "FCFS",
      "SSTF (Shortest Seek Time First)",
      "SCAN",
      "LOOK",
    ],
    correctAnswer: 1,
    explanation:
      "SSTF selects the request closest to the current head position, minimizing seek time, though it can cause starvation of distant requests.",
  },
  {
    id: "os-9",
    subject: "os",
    question: "What does the 'fork()' system call return to the child process?",
    options: [
      "The PID of the parent",
      "A negative value",
      "Zero (0)",
      "The PID of the child",
    ],
    correctAnswer: 2,
    explanation:
      "fork() returns 0 to the child process, the child's PID to the parent, and -1 on failure.",
  },
  {
    id: "os-10",
    subject: "os",
    question: "Which memory allocation strategy leads to external fragmentation the most?",
    options: [
      "Paging",
      "First Fit (contiguous allocation)",
      "Segmentation with paging",
      "Buddy System",
    ],
    correctAnswer: 1,
    explanation:
      "Contiguous allocation strategies like First Fit leave scattered free holes (external fragmentation). Paging eliminates external fragmentation entirely.",
  },

  // ═══════════════════════════════════════════════════════════
  //  DATABASE MANAGEMENT SYSTEMS  (dbms)
  // ═══════════════════════════════════════════════════════════
  {
    id: "dbms-1",
    subject: "dbms",
    question: "Which normal form eliminates transitive dependencies?",
    options: [
      "First Normal Form (1NF)",
      "Second Normal Form (2NF)",
      "Third Normal Form (3NF)",
      "Boyce-Codd Normal Form (BCNF)",
    ],
    correctAnswer: 2,
    explanation:
      "3NF removes transitive dependencies — no non-prime attribute should depend on another non-prime attribute.",
  },
  {
    id: "dbms-2",
    subject: "dbms",
    question: "What does the 'D' in ACID properties stand for?",
    options: [
      "Data Integrity",
      "Durability",
      "Dependency",
      "Distribution",
    ],
    correctAnswer: 1,
    explanation:
      "ACID stands for Atomicity, Consistency, Isolation, Durability. Durability ensures committed transactions persist even after system failure.",
  },
  {
    id: "dbms-3",
    subject: "dbms",
    question: "Which SQL JOIN returns all rows from the left table even if there is no match in the right table?",
    options: [
      "INNER JOIN",
      "RIGHT JOIN",
      "LEFT JOIN",
      "CROSS JOIN",
    ],
    correctAnswer: 2,
    explanation:
      "A LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table with NULL values for unmatched columns from the right table.",
  },
  {
    id: "dbms-4",
    subject: "dbms",
    question: "What is the purpose of an index in a database?",
    options: [
      "To enforce referential integrity",
      "To speed up data retrieval operations",
      "To normalize the database",
      "To encrypt stored data",
    ],
    correctAnswer: 1,
    explanation:
      "Indexes create data structures (e.g., B-trees, hash tables) that allow the DBMS to find rows faster without scanning the entire table.",
  },
  {
    id: "dbms-5",
    subject: "dbms",
    question: "Which type of key uniquely identifies each record in a table?",
    options: [
      "Foreign Key",
      "Candidate Key",
      "Primary Key",
      "Super Key",
    ],
    correctAnswer: 2,
    explanation:
      "A Primary Key is a chosen candidate key that uniquely identifies every record in a table and cannot contain NULL values.",
  },
  {
    id: "dbms-6",
    subject: "dbms",
    question: "In the relational model, what is a 'tuple'?",
    options: [
      "A column in a table",
      "A row in a table",
      "The schema of a table",
      "A constraint on a table",
    ],
    correctAnswer: 1,
    explanation:
      "In relational algebra, a tuple corresponds to a single row (record) in a relation (table).",
  },
  {
    id: "dbms-7",
    subject: "dbms",
    question: "What does a HAVING clause do in SQL?",
    options: [
      "Filters rows before grouping",
      "Filters groups after the GROUP BY operation",
      "Sorts the result set",
      "Joins two tables",
    ],
    correctAnswer: 1,
    explanation:
      "HAVING filters aggregated groups (after GROUP BY), while WHERE filters individual rows before grouping.",
  },
  {
    id: "dbms-8",
    subject: "dbms",
    question: "Which concurrency control protocol uses timestamps to order transactions?",
    options: [
      "Two-Phase Locking (2PL)",
      "Timestamp Ordering Protocol",
      "Optimistic Concurrency Control",
      "Multi-Version Concurrency Control",
    ],
    correctAnswer: 1,
    explanation:
      "The Timestamp Ordering Protocol assigns timestamps to transactions and ensures conflicting operations execute in timestamp order.",
  },
  {
    id: "dbms-9",
    subject: "dbms",
    question: "What is a 'view' in SQL?",
    options: [
      "A copy of a table stored on disk",
      "A virtual table based on the result of a SELECT query",
      "A temporary index",
      "A backup of the database",
    ],
    correctAnswer: 1,
    explanation:
      "A view is a virtual table — it doesn't store data itself but provides a named SELECT query that can be referenced like a table.",
  },
  {
    id: "dbms-10",
    subject: "dbms",
    question: "Which of the following is a NoSQL database?",
    options: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Oracle",
    ],
    correctAnswer: 2,
    explanation:
      "MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like BSON documents.",
  },

  // ═══════════════════════════════════════════════════════════
  //  OBJECT-ORIENTED PROGRAMMING  (oops)
  // ═══════════════════════════════════════════════════════════
  {
    id: "oops-1",
    subject: "oops",
    question: "Which OOP principle allows a class to inherit properties and methods from another class?",
    options: [
      "Encapsulation",
      "Polymorphism",
      "Inheritance",
      "Abstraction",
    ],
    correctAnswer: 2,
    explanation:
      "Inheritance enables a child class to acquire fields and methods of a parent class, promoting code reuse.",
  },
  {
    id: "oops-2",
    subject: "oops",
    question: "What is the difference between method overloading and method overriding?",
    options: [
      "Overloading changes the return type; overriding changes the method name",
      "Overloading uses same name with different parameters in the same class; overriding redefines a parent method in a child class",
      "They are the same thing",
      "Overriding uses different parameters; overloading redefines a parent method",
    ],
    correctAnswer: 1,
    explanation:
      "Overloading (compile-time polymorphism) = same method name, different parameter list, same class. Overriding (runtime polymorphism) = same signature, child class redefines parent method.",
  },
  {
    id: "oops-3",
    subject: "oops",
    question: "What does the 'abstract' keyword mean when applied to a class?",
    options: [
      "The class is final and cannot be extended",
      "The class cannot be instantiated and may contain abstract methods",
      "The class is automatically singleton",
      "The class has only static methods",
    ],
    correctAnswer: 1,
    explanation:
      "An abstract class cannot be instantiated directly. It can have abstract methods (no body) that subclasses must implement.",
  },
  {
    id: "oops-4",
    subject: "oops",
    question: "Which SOLID principle states 'a class should have only one reason to change'?",
    options: [
      "Open/Closed Principle",
      "Liskov Substitution Principle",
      "Single Responsibility Principle",
      "Dependency Inversion Principle",
    ],
    correctAnswer: 2,
    explanation:
      "SRP states each class should have one responsibility (one reason to change), keeping classes focused and maintainable.",
  },
  {
    id: "oops-5",
    subject: "oops",
    question: "What is encapsulation?",
    options: [
      "Inheriting methods from a parent class",
      "Bundling data and methods together and restricting direct access to internal state",
      "Creating multiple forms of a method",
      "Hiding the entire class from other packages",
    ],
    correctAnswer: 1,
    explanation:
      "Encapsulation bundles data (fields) and methods into a class while using access modifiers (private, protected, public) to control access.",
  },
  {
    id: "oops-6",
    subject: "oops",
    question: "Which design pattern ensures only one instance of a class exists?",
    options: [
      "Factory Pattern",
      "Observer Pattern",
      "Singleton Pattern",
      "Strategy Pattern",
    ],
    correctAnswer: 2,
    explanation:
      "The Singleton pattern restricts instantiation to a single instance by making the constructor private and providing a static access point.",
  },
  {
    id: "oops-7",
    subject: "oops",
    question: "What is polymorphism?",
    options: [
      "Hiding internal data from external access",
      "The ability of different objects to respond to the same method call in different ways",
      "Creating a new class from an existing class",
      "Breaking a program into modules",
    ],
    correctAnswer: 1,
    explanation:
      "Polymorphism ('many forms') allows objects of different classes to be treated through a common interface, with each class providing its own implementation.",
  },
  {
    id: "oops-8",
    subject: "oops",
    question: "In Java, can a class implement multiple interfaces?",
    options: [
      "No, Java only allows single inheritance",
      "Yes, a class can implement multiple interfaces",
      "Only if the interfaces have no methods",
      "Only abstract classes can implement multiple interfaces",
    ],
    correctAnswer: 1,
    explanation:
      "Java supports multiple interface implementation (but not multiple class inheritance), allowing a class to conform to multiple contracts.",
  },
  {
    id: "oops-9",
    subject: "oops",
    question: "What is the 'diamond problem' in OOP?",
    options: [
      "A memory leak caused by circular references",
      "Ambiguity when a class inherits from two classes that share a common ancestor",
      "A performance issue with deep inheritance hierarchies",
      "A naming conflict between packages",
    ],
    correctAnswer: 1,
    explanation:
      "The diamond problem occurs in multiple inheritance when class D inherits from B and C, both of which inherit from A — creating ambiguity about which path to use.",
  },
  {
    id: "oops-10",
    subject: "oops",
    question: "What is the purpose of a constructor in OOP?",
    options: [
      "To destroy an object when it is no longer needed",
      "To initialize an object's state when it is created",
      "To define the object's static methods",
      "To inherit from a parent class",
    ],
    correctAnswer: 1,
    explanation:
      "A constructor is a special method called automatically when an object is created. It sets the initial state of the object.",
  },

  // ═══════════════════════════════════════════════════════════
  //  COMPUTER NETWORKS  (cn)
  // ═══════════════════════════════════════════════════════════
  {
    id: "cn-1",
    subject: "cn",
    question: "How many layers does the OSI model have?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 3,
    explanation:
      "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.",
  },
  {
    id: "cn-2",
    subject: "cn",
    question: "Which protocol provides reliable, connection-oriented communication?",
    options: ["UDP", "TCP", "ICMP", "ARP"],
    correctAnswer: 1,
    explanation:
      "TCP (Transmission Control Protocol) provides reliable, ordered, error-checked delivery of data using a three-way handshake and acknowledgments.",
  },
  {
    id: "cn-3",
    subject: "cn",
    question: "What is the primary function of DNS?",
    options: [
      "Encrypting web traffic",
      "Translating domain names to IP addresses",
      "Routing packets between networks",
      "Managing email delivery",
    ],
    correctAnswer: 1,
    explanation:
      "DNS (Domain Name System) resolves human-readable domain names (e.g., google.com) into IP addresses (e.g., 142.250.190.14).",
  },
  {
    id: "cn-4",
    subject: "cn",
    question: "Which device operates at Layer 3 (Network layer) of the OSI model?",
    options: ["Hub", "Switch", "Router", "Repeater"],
    correctAnswer: 2,
    explanation:
      "Routers operate at the Network layer, making forwarding decisions based on IP addresses. Switches operate at Layer 2 (Data Link).",
  },
  {
    id: "cn-5",
    subject: "cn",
    question: "What is the subnet mask for a /24 network?",
    options: [
      "255.255.0.0",
      "255.255.255.0",
      "255.255.255.128",
      "255.255.255.255",
    ],
    correctAnswer: 1,
    explanation:
      "A /24 prefix means the first 24 bits are network bits, giving a subnet mask of 255.255.255.0 (11111111.11111111.11111111.00000000).",
  },
  {
    id: "cn-6",
    subject: "cn",
    question: "What is the main difference between HTTP and HTTPS?",
    options: [
      "HTTPS is faster than HTTP",
      "HTTPS encrypts data using TLS/SSL for secure communication",
      "HTTP supports video while HTTPS does not",
      "HTTPS uses UDP while HTTP uses TCP",
    ],
    correctAnswer: 1,
    explanation:
      "HTTPS adds a TLS/SSL encryption layer on top of HTTP, ensuring data confidentiality, integrity, and server authentication.",
  },
  {
    id: "cn-7",
    subject: "cn",
    question: "What does NAT (Network Address Translation) do?",
    options: [
      "Encrypts network traffic",
      "Maps private IP addresses to public IP addresses",
      "Assigns IP addresses dynamically",
      "Monitors network bandwidth",
    ],
    correctAnswer: 1,
    explanation:
      "NAT translates private (internal) IP addresses to public (external) IP addresses, allowing multiple devices to share a single public IP.",
  },
  {
    id: "cn-8",
    subject: "cn",
    question: "Which transport layer protocol is used for real-time video streaming?",
    options: ["TCP", "FTP", "UDP", "SMTP"],
    correctAnswer: 2,
    explanation:
      "UDP is preferred for real-time applications (video, VoIP, gaming) because it has lower latency — no connection setup or retransmission overhead.",
  },
  {
    id: "cn-9",
    subject: "cn",
    question: "What is the purpose of ARP (Address Resolution Protocol)?",
    options: [
      "Resolving domain names to IP addresses",
      "Mapping IP addresses to MAC addresses",
      "Routing packets across the internet",
      "Establishing a TCP connection",
    ],
    correctAnswer: 1,
    explanation:
      "ARP resolves a known IP address to the corresponding MAC (hardware) address on a local network segment.",
  },
  {
    id: "cn-10",
    subject: "cn",
    question: "In TCP, what is the three-way handshake sequence?",
    options: [
      "ACK → SYN → FIN",
      "SYN → SYN-ACK → ACK",
      "FIN → ACK → SYN",
      "SYN → ACK → FIN",
    ],
    correctAnswer: 1,
    explanation:
      "TCP establishes a connection with: Client sends SYN → Server responds with SYN-ACK → Client sends ACK. Connection is now established.",
  },

  // ═══════════════════════════════════════════════════════════
  //  DATA STRUCTURES & ALGORITHMS  (dsa)
  // ═══════════════════════════════════════════════════════════
  {
    id: "dsa-1",
    subject: "dsa",
    question: "What is the time complexity of searching in a balanced Binary Search Tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation:
      "In a balanced BST, each comparison eliminates half the remaining nodes, giving O(log n) search time.",
  },
  {
    id: "dsa-2",
    subject: "dsa",
    question: "Which data structure uses LIFO (Last In First Out) ordering?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation:
      "A Stack follows LIFO — the last element pushed is the first one popped. Used in function calls, undo operations, and expression parsing.",
  },
  {
    id: "dsa-3",
    subject: "dsa",
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
    explanation:
      "QuickSort degrades to O(n²) when the pivot is consistently the smallest or largest element (e.g., already sorted array with first-element pivot).",
  },
  {
    id: "dsa-4",
    subject: "dsa",
    question: "Which algorithm is best suited for finding the shortest path in a weighted graph with non-negative edges?",
    options: [
      "Depth-First Search (DFS)",
      "Bellman-Ford Algorithm",
      "Dijkstra's Algorithm",
      "Floyd-Warshall Algorithm",
    ],
    correctAnswer: 2,
    explanation:
      "Dijkstra's algorithm finds the shortest path from a single source using a greedy approach with a priority queue, but requires non-negative edge weights.",
  },
  {
    id: "dsa-5",
    subject: "dsa",
    question: "What is the average-case time complexity of a hash table lookup?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0,
    explanation:
      "Hash tables provide O(1) average-case lookup by computing the hash of the key to directly find the bucket. Worst-case is O(n) due to collisions.",
  },
  {
    id: "dsa-6",
    subject: "dsa",
    question: "Which traversal of a Binary Search Tree gives elements in sorted order?",
    options: [
      "Preorder (Root-Left-Right)",
      "Inorder (Left-Root-Right)",
      "Postorder (Left-Right-Root)",
      "Level Order (BFS)",
    ],
    correctAnswer: 1,
    explanation:
      "Inorder traversal of a BST visits nodes in ascending order: left subtree → root → right subtree.",
  },
  {
    id: "dsa-7",
    subject: "dsa",
    question: "What is dynamic programming?",
    options: [
      "A technique for dynamically allocating memory",
      "An optimization technique that solves overlapping subproblems by storing their results",
      "A method for real-time data processing",
      "A type of recursive function",
    ],
    correctAnswer: 1,
    explanation:
      "DP solves complex problems by breaking them into overlapping subproblems and storing results (memoization/tabulation) to avoid redundant computation.",
  },
  {
    id: "dsa-8",
    subject: "dsa",
    question: "What is the space complexity of Merge Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 2,
    explanation:
      "Merge Sort requires O(n) additional space for the temporary arrays used during the merge step.",
  },
  {
    id: "dsa-9",
    subject: "dsa",
    question: "Which data structure is most efficient for implementing a priority queue?",
    options: [
      "Sorted Array",
      "Linked List",
      "Binary Heap",
      "Hash Table",
    ],
    correctAnswer: 2,
    explanation:
      "A Binary Heap (min-heap or max-heap) provides O(log n) insertion and O(log n) extraction of the min/max element, making it ideal for priority queues.",
  },
  {
    id: "dsa-10",
    subject: "dsa",
    question: "What is the primary advantage of a linked list over an array?",
    options: [
      "Faster random access",
      "Uses less memory per element",
      "Dynamic size with efficient insertions/deletions at any position",
      "Better cache performance",
    ],
    correctAnswer: 2,
    explanation:
      "Linked lists allow O(1) insertions/deletions (given a reference) without shifting elements, and grow/shrink dynamically. Arrays have better cache locality and O(1) random access.",
  },
];
