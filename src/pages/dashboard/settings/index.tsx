import { useTheme } from "@/providers/theme-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PageHeader from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SettingsPage = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-full flex flex-col ">
      <PageHeader title="Settings" />

      <div className="flex-1 space-y-4 p-3">
        <Tabs
          defaultValue="appearance"
          className="w-full"
        >
          <TabsList className="gap-2">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent
            value="appearance"
            className="mt-8"
          >
            <div className="max-w-4xl">
              <div className="flex justify-between items-start py-5">
                <div className="space-y-1.5">
                  <h2 className="text-base font-medium leading-none">
                    System Theme
                  </h2>
                  <p className="text-sm text-muted-foreground/60">
                    This area contains system theme settings.
                  </p>
                </div>
                <div className="w-[200px]">
                  <Select
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SettingsPage
