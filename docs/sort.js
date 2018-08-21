function swap(nums, i, j) {
  let tmp = nums[i]
  nums[i] = nums[j]
  nums[j] = tmp
}

/**
 * 插入排序
 * 当前位置的值与之前的每个值比较，若小于，则交换；
 */
function insertionSort(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] < nums[j]) {
        swap(nums, i, j)
      }
    }
  }
}
/**
 * 选择排序
 * 当前位置的值与之后的最小值进行交换
 */
function selectionSort(nums) {
  for (let i = 0; i < nums.length; i++) {
    let minIndex = i
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] < nums[minIndex]) {
        minIndex = j
      }
    }
    swap(nums, i, minIndex)
  }
}
/**
 * 冒泡排序
 * 经过n-1趟子排序完成的
 * 第i趟子排序从第1个数至第n-i个数，若第i个数比后一个数大（则升序，小则降序）则交换两数
 */
function bubbleSort(nums) {
  for (let i = 0; i < nums.length; i++) {
    exchange = false
    for (let j = nums.length - 1; j > i; j--) {
      if (nums[j] < nums[j - 1]) {
        swap(nums, j, j - 1)
        exchange = true
      }
    }
    if (!exchange) return nums
  }
  return nums
}
/**
 * 快速排序
 * 分治递归
 */
function quickSort(nums) {
  partQuickSort(nums, 0, nums.length - 1)
}
function partQuickSort(nums, low, high) {
  if (high <= low) return
  let index = partition(nums, low, high)
  partQuickSort(nums, low, index - 1)
  partQuickSort(nums, index + 1, high)
}
function partition(nums, low, high) {
  let pivot = nums[low]
  while (low < high) {
    while (low < high && nums[high] > pivot) {
      --high
    }
    nums[low] = nums[high]
    while (low < high && nums[low] <= pivot) {
      ++low
    }
    nums[high] = nums[low]
  }
  nums[low] = pivot
  return low
}
/**
 * 归并排序
 * 分治递归
 */
function mergeSort(arr) {
  // 采用自上而下的递归方法
  let len = arr.length
  if (len < 2) {
    return arr
  }
  let middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle)
  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  let result = []
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  while (left.length) result.push(left.shift())
  while (right.length) result.push(right.shift())
  return result
}
/**
 * 堆排序
 */
function heapSort(nums) {
  function swap(array, i, j) {
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  function sort(array) {
    buildMaxHeap(array)

    for (var i = array.length - 1; i > 0; i--) {
      // 每次将大堆顶数放在数组末
      swap(array, 0, i)
      // 重新建堆
      maxHeapify(array, 0, i)
    }
    return array
  }
  // 从 index 开始检查并保持最大堆性质
  function maxHeapify(array, index, heapSize) {
    let iMax = index
    let iLeft = 2 * index + 1
    let iRight = 2 * (index + 1)
    if (iLeft < heapSize && array[index] < array[iLeft]) {
      iMax = iLeft
    }
    if (iRight < heapSize && array[iMax] < array[iRight]) {
      iMax = iRight
    }
    if (iMax != index) {
      swap(array, iMax, index)
      maxHeapify(array, iMax, heapSize)
    }
  }
  function buildMaxHeap(array) {
    // 从第一个非叶子节点开始即可。无需从最后一个叶子节点开始。
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      maxHeapify(array, i, array.length)
    }
  }
  return sort(nums)
}
