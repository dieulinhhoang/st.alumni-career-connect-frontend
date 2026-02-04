import { editorLocalization, SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useMemo } from "react";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import "../Survey/survey-vi";
import { applyVietnamese } from "../Survey/survey-vi";
import { surveyLocalization } from "survey-core";

applyVietnamese();
  const CreateOption = {
        showLogicTab: true,
        showThemeTab: true,
        showImportTab: true,
        isAutoSave: true,
        showTranslationTab: true,
    }

const  AllForms: React.FC = () => {
   
editorLocalization.currentLocale = "vi";
surveyLocalization.currentLocale = "vi";   
const creator = useMemo(() => {
    editorLocalization.currentLocale = "vi";
    const createData = new SurveyCreator(CreateOption);
    // Thiết lập cho bản khảo sát đang thiết kế
    createData.survey.locale = "vi";
 
    // Setup theme
    createData.theme = {
        "cssVariables": {
            "--sjs-primary-backcolor": "#7f5af0",
            "--sjs-primary-backcolor-light": "rgba(127, 90, 240, 0.1)",
            "--sjs-corner-radius": "12px",
            "--sjs-base-unit": "8px"
        }
    };
    // createData.saveSurveyFunc = (saveNo: number, callback: (no: number, success: boolean) => void) => {
     //     const surveyDefinition = createData.JSON; 
    //     console.log("File JSON thiết kế:", JSON.stringify(surveyDefinition, null, 3));

    //     // Giả lập gọi API lưu vào DB
    //     setTimeout(() => {
    //         alert("Đã lưu form thành công vào Database!");
    //         callback(saveNo, true);
    //     }, 1000);
    // };

    return createData;
}, []);
    return (
        <AdminLayout onCollapse={() => {}}>
            <div   style={{ minHeight: '100vh', width : '100%'}}
                >
                <SurveyCreatorComponent creator={creator} />
            </div>
        </AdminLayout>
    )
}
export default AllForms;