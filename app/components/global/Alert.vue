<template>
  <div class="py-6">
    <div class="bg-yellow-500 text-black rounded-xl md:grid grid-flow-col p-6 justify-start items-start gap-6">
      <Icon size="32" name="tabler:alert-triangle-filled" />
      <span class="[&_*]:text-black"><slot /></span>
    </div>
  </div>
</template>
