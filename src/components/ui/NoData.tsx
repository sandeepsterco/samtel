import './noData.css'

export default function NoData({ heading, para }: { heading?: string, para?: string }) {
    return (
        <div className="no_data_parent">
            <h2 className="title">{heading ? heading : 'No Data found!'}</h2>
            <p className="para">
                {para ? para : `Failed to get data.`}
            </p>
        </div>
    )
}