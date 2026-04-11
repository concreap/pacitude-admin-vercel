import React, {  MouseEvent } from "react"
import Badge from "../../../components/partials/badges/Badge";
import { SemanticType } from "../../../utils/types.util";
import { Link } from "react-router-dom";
import CardUI from "../../../components/partials/ui/CardUI";
import { Library } from "../../../models/Library.model";
import useLibrary from "../../../hooks/app/useLibrary";

interface ILibraryCard {
    className?: string,
    library: Library,
    toRoute?: (e: MouseEvent<HTMLElement>,) => void
}

const LibraryCard = (props: ILibraryCard) => {

    const { className = '', library, toRoute } = props;
    const { getStatusType } = useLibrary()

    return (
        <>

            <Link to={``} onClick={toRoute}>

                <CardUI>
                    <div className="min-h-[70px]">
                        <div className="flex items-center gap-x-[2rem] grow">
                            <div className="min-w-[30%] min-h-[86px] rounded-[8px] full-bg" style={{ backgroundImage: `url(${library?.banner ?? ''})` }}></div>
                            <div className="space-y-[0.67rem]">
                                <h3 className="font-mona-medium pas-950 text-[15px]">{library?.title ?? ''}</h3>
                                <div className="flex items-center gap-x-[1rem]">

                                    <Badge
                                        type={getStatusType(library.status)}
                                        size="sm"
                                        display="badge"
                                        label={library.status}
                                        padding={{ y: 3, x: 12 }}
                                        font={{
                                            weight: 'regular',
                                            size: 11
                                        }}
                                        upper={true}
                                        close={false}
                                    />

                                    <h3 className="font-mona-light pag-500 text-[13px]">Code: {library?.code || ''}</h3>

                                </div>
                            </div>

                        </div>

                    </div>
                </CardUI>

            </Link>
        </>
    )
};

export default LibraryCard;
