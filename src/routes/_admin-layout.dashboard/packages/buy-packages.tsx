import { checkoutApi } from "@/core/api/checkout.api";
import { packageApi } from "@/core/api/package.api";
import FieldBuilder from "@/core/components/field/FieldBuilder";
import { FieldType } from "@/core/components/field/FieldDisplay";
import FormBuilder from "@/core/components/form/FormBuilder";
import { NKFormType } from "@/core/components/form/NKForm";
import { NKConstant } from "@/core/NKConstant";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Joi from "joi";
import { useRef, useState } from "react";

const Page = () => {
    const [packageId, setPackageId] = useState(1);
    const newWindowRef = useRef<any>(null)

    const violationQuery = useQuery({
        queryKey: ['packages', packageId],
        queryFn: () => {
            return packageApi.getById(Number(packageId));
        },
    });

    return (
        <div className="grid grid-cols-3 gap-3">
            <section className="col-span-1">
                <FormBuilder
                    apiAction={(data) => {
                        return checkoutApi.create(data.packageId)
                    }}
                    title="Buy Package"
                    defaultValues={{
                        packageId: packageId
                    }}
                    schema={{
                        packageId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    }}
                    fields={[
                        {
                            label: "Package",
                            name: "packageId",
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction(value) {
                                    return packageApi.getEnumSelectOptions(value);
                                },
                            },
                            onChangeExtra: (value) => setPackageId(value),
                        }
                    ]}
                    onExtraErrorAction={() => { }}
                    onExtraSuccessAction={(data) => {
                        console.log(data);
                        
                        let windowWidth = 600;
                        let windowHeight = 800;
                        let yPosition = window.outerHeight / 2 - windowHeight / 2 + window.screenY;
                        let xPosition = window.outerWidth / 2 - windowWidth / 2 + window.screenX;

                        newWindowRef.current = window.open(data.data.checkoutUrl, "NewWindow", `height=${windowHeight}, width=${windowWidth}, top=${yPosition}, left=${xPosition}`)
                    }}
                />
            </section>
            <section className="col-span-2">
                <FieldBuilder
                    title="Detail Package"
                    record={violationQuery.data}
                    isPadding={false}
                    containerClassName="p-4"
                    fields={[
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'price',
                            title: 'Price',
                            type: FieldType.NUMBER,
                        },
                    ]}
                />
            </section>
        </div >
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/packages/buy-packages')({
    component: Page,
});
