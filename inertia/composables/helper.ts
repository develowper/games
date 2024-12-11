import {onMounted} from 'vue'
import {usePage} from "@inertiajs/vue3";

// by convention, composable function names start with "use"
export function useHelper() {


  const langFile: any = usePage().props.langFile;

  onMounted(() => {
  })

  function __(key: string): string {
    return langFile && key ? langFile[key] : '';
    // console.log(props.langFile)
  }

  // expose managed state as return value
  return {__}
}
