let array = [];
let isSorting = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;

const visualization = document.getElementById('visualization');
const algorithmSelect = document.getElementById('algorithm');
const arraySizeInput = document.getElementById('arraySize');
const speedInput = document.getElementById('speed');
const generateBtn = document.getElementById('generateArray');
const startBtn = document.getElementById('startSort');
const sizeValue = document.getElementById('sizeValue');
const speedValue = document.getElementById('speedValue');

const algorithmInfo = {
	bubble: {
		name: "Bubble Sort",
		description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
		complexity: {
			best: "O(n)",
			average: "O(n²)",
			worst: "O(n²)",
			space: "O(1)"
		},
		stable: "Yes",
		inPlace: "Yes",
		useCase: "Educational purposes, small datasets, nearly sorted data"
	},
	selection: {
		name: "Selection Sort",
		description: "Selection Sort divides the input list into two parts: a sorted portion and an unsorted portion. It repeatedly selects the smallest element from the unsorted portion and moves it to the end of the sorted portion.",
		complexity: {
			best: "O(n²)",
			average: "O(n²)",
			worst: "O(n²)",
			space: "O(1)"
		},
		stable: "No",
		inPlace: "Yes",
		useCase: "Small datasets, when memory write is costly"
	},
	insertion: {
		name: "Insertion Sort",
		description: "Insertion Sort builds the final sorted array one item at a time. It takes each element from the input and finds the location it belongs within the sorted list and inserts it there.",
		complexity: {
			best: "O(n)",
			average: "O(n²)",
			worst: "O(n²)",
			space: "O(1)"
		},
		stable: "Yes",
		inPlace: "Yes",
		useCase: "Small datasets, nearly sorted data, online sorting"
	},
	merge: {
		name: "Merge Sort",
		description: "Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves together.",
		complexity: {
			best: "O(n log n)",
			average: "O(n log n)",
			worst: "O(n log n)",
			space: "O(n)"
		},
		stable: "Yes",
		inPlace: "No",
		useCase: "Large datasets, external sorting, when stable sort is needed"
	},
	quick: {
		name: "Quick Sort",
		description: "Quick Sort is a divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around the pivot, placing smaller elements before it and larger elements after it.",
		complexity: {
			best: "O(n log n)",
			average: "O(n log n)",
			worst: "O(n²)",
			space: "O(log n)"
		},
		stable: "No",
		inPlace: "Yes",
		useCase: "General purpose sorting, large datasets, when average performance matters"
	},
	heap: {
		name: "Heap Sort",
		description: "Heap Sort converts the array into a heap data structure, then repeatedly extracts the maximum element from the heap and rebuilds the heap until all elements are sorted.",
		complexity: {
			best: "O(n log n)",
			average: "O(n log n)",
			worst: "O(n log n)",
			space: "O(1)"
		},
		stable: "No",
		inPlace: "Yes",
		useCase: "When consistent O(n log n) performance is needed, priority queues"
	}
};

arraySizeInput.addEventListener('input', (e) => {
	sizeValue.textContent = e.target.value;
	if (!isSorting) generateArray();
});

speedInput.addEventListener('input', (e) => {
	speedValue.textContent = e.target.value;
});

algorithmSelect.addEventListener('change', updateAlgorithmInfo);
generateBtn.addEventListener('click', generateArray);
startBtn.addEventListener('click', startSort);

function generateArray() {
	const size = parseInt(arraySizeInput.value);
	array = Array.from({length: size}, () => Math.floor(Math.random() * 350) + 20);
	renderArray();
	resetStats();
	updateAlgorithmInfo();
}

function renderArray(compareIndices = [], sortedIndices = [], pivotIndex = -1) {
	visualization.innerHTML = '';
	const barWidth = Math.max(2, Math.floor((visualization.offsetWidth - array.length * 2) / array.length));
    
	array.forEach((value, index) => {
		const bar = document.createElement('div');
		bar.className = 'bar';
		bar.style.height = `${value}px`;
		bar.style.width = `${barWidth}px`;
        
		if (sortedIndices.includes(index)) {
			bar.classList.add('sorted');
		} else if (index === pivotIndex) {
			bar.classList.add('pivot');
		} else if (compareIndices.includes(index)) {
			bar.classList.add('comparing');
		}
        
		visualization.appendChild(bar);
	});
}

function resetStats() {
	comparisons = 0;
	swaps = 0;
	startTime = 0;
	document.getElementById('comparisons').textContent = '0';
	document.getElementById('swaps').textContent = '0';
	document.getElementById('time').textContent = '0';
}

function updateStats() {
	document.getElementById('comparisons').textContent = comparisons;
	document.getElementById('swaps').textContent = swaps;
	if (startTime) {
		document.getElementById('time').textContent = (Date.now() - startTime);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSort() {
	if (isSorting) return;
	isSorting = true;
	startBtn.disabled = true;
	generateBtn.disabled = true;
	resetStats();
	startTime = Date.now();

	const algorithm = algorithmSelect.value;
    
	switch(algorithm) {
		case 'bubble': await bubbleSort(); break;
		case 'selection': await selectionSort(); break;
		case 'insertion': await insertionSort(); break;
		case 'merge': await mergeSort(0, array.length - 1); break;
		case 'quick': await quickSort(0, array.length - 1); break;
		case 'heap': await heapSort(); break;
	}

	renderArray([], Array.from({length: array.length}, (_, i) => i));
	updateStats();
	isSorting = false;
	startBtn.disabled = false;
	generateBtn.disabled = false;
}

async function bubbleSort() {
	const n = array.length;
	for (let i = 0; i < n - 1; i++) {
		for (let j = 0; j < n - i - 1; j++) {
			comparisons++;
			renderArray([j, j + 1], Array.from({length: n - i - 1 + 1}, (_, k) => n - k - 1));
			updateStats();
			await sleep(speedInput.value);
            
			if (array[j] > array[j + 1]) {
				[array[j], array[j + 1]] = [array[j + 1], array[j]];
				swaps++;
			}
		}
	}
}

async function selectionSort() {
	const n = array.length;
	for (let i = 0; i < n - 1; i++) {
		let minIdx = i;
		for (let j = i + 1; j < n; j++) {
			comparisons++;
			renderArray([minIdx, j], Array.from({length: i}, (_, k) => k));
			updateStats();
			await sleep(speedInput.value);
            
			if (array[j] < array[minIdx]) {
				minIdx = j;
			}
		}
		if (minIdx !== i) {
			[array[i], array[minIdx]] = [array[minIdx], array[i]];
			swaps++;
		}
	}
}

async function insertionSort() {
	const n = array.length;
	for (let i = 1; i < n; i++) {
		let key = array[i];
		let j = i - 1;
        
		while (j >= 0 && array[j] > key) {
			comparisons++;
			renderArray([j, j + 1], Array.from({length: i}, (_, k) => k));
			updateStats();
			await sleep(speedInput.value);
            
			array[j + 1] = array[j];
			swaps++;
			j--;
		}
		array[j + 1] = key;
	}
}

async function mergeSort(left, right) {
	if (left < right) {
		const mid = Math.floor((left + right) / 2);
		await mergeSort(left, mid);
		await mergeSort(mid + 1, right);
		await merge(left, mid, right);
	}
}

async function merge(left, mid, right) {
	const leftArr = array.slice(left, mid + 1);
	const rightArr = array.slice(mid + 1, right + 1);
	let i = 0, j = 0, k = left;

	while (i < leftArr.length && j < rightArr.length) {
		comparisons++;
		renderArray([left + i, mid + 1 + j]);
		updateStats();
		await sleep(speedInput.value);

		if (leftArr[i] <= rightArr[j]) {
			array[k++] = leftArr[i++];
		} else {
			array[k++] = rightArr[j++];
		}
		swaps++;
	}

	while (i < leftArr.length) {
		array[k++] = leftArr[i++];
		swaps++;
	}

	while (j < rightArr.length) {
		array[k++] = rightArr[j++];
		swaps++;
	}
}

async function quickSort(low, high) {
	if (low < high) {
		const pi = await partition(low, high);
		await quickSort(low, pi - 1);
		await quickSort(pi + 1, high);
	}
}

async function partition(low, high) {
	const pivot = array[high];
	let i = low - 1;

	for (let j = low; j < high; j++) {
		comparisons++;
		renderArray([j, high], [], high);
		updateStats();
		await sleep(speedInput.value);

		if (array[j] < pivot) {
			i++;
			[array[i], array[j]] = [array[j], array[i]];
			swaps++;
		}
	}
	[array[i + 1], array[high]] = [array[high], array[i + 1]];
	swaps++;
	return i + 1;
}

async function heapSort() {
	const n = array.length;

	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		await heapify(n, i);
	}

	for (let i = n - 1; i > 0; i--) {
		[array[0], array[i]] = [array[i], array[0]];
		swaps++;
		renderArray([0, i], Array.from({length: n - i}, (_, k) => n - k - 1));
		updateStats();
		await sleep(speedInput.value);
		await heapify(i, 0);
	}
}

async function heapify(n, i) {
	let largest = i;
	const left = 2 * i + 1;
	const right = 2 * i + 2;

	if (left < n) {
		comparisons++;
		if (array[left] > array[largest]) {
			largest = left;
		}
	}

	if (right < n) {
		comparisons++;
		if (array[right] > array[largest]) {
			largest = right;
		}
	}

	if (largest !== i) {
		[array[i], array[largest]] = [array[largest], array[i]];
		swaps++;
		renderArray([i, largest]);
		updateStats();
		await sleep(speedInput.value);
		await heapify(n, largest);
	}
}

function updateAlgorithmInfo() {
	const algorithm = algorithmSelect.value;
	const info = algorithmInfo[algorithm];
    
	document.getElementById('algorithmInfo').innerHTML = `
		<div class="info-card">
			<h3>Algorithm: ${info.name}</h3>
			<p>${info.description}</p>
		</div>
		<div class="info-card">
			<h3>Time & Space Complexity</h3>
			<table class="complexity-table">
				<tr><td>Best Case:</td><td>${info.complexity.best}</td></tr>
				<tr><td>Average Case:</td><td>${info.complexity.average}</td></tr>
				<tr><td>Worst Case:</td><td>${info.complexity.worst}</td></tr>
				<tr><td>Space Complexity:</td><td>${info.complexity.space}</td></tr>
			</table>
		</div>
		<div class="info-card">
			<h3>Properties & Use Cases</h3>
			<table class="complexity-table">
				<tr><td>Stable:</td><td>${info.stable}</td></tr>
				<tr><td>In-Place:</td><td>${info.inPlace}</td></tr>
			</table>
			<p style="margin-top: 15px;"><strong>Best Used For:</strong><br>${info.useCase}</p>
		</div>
	`;
}

generateArray();

