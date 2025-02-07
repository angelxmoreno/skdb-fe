import {FC} from "react";
import {Card} from "react-bootstrap";
import {SerialKiller} from "@entities/Models";
import {Link} from "@tanstack/react-router";

type ProfileCardProps = {
    serialKiller: SerialKiller | undefined
}
const ProfileCard: FC<ProfileCardProps> = ({serialKiller}) => {
    return (
        <Card className="text-center">
            <Card.Header as={'h2'} className={'h4'}>{serialKiller?.name}</Card.Header>
            {serialKiller?.photo_url && (
                <Card.Img
                    src={serialKiller.photo_url}
                    alt={serialKiller.name}
                    style={{height: '200px', width: '100%', objectFit: 'cover'}}
                />
            )}
            {serialKiller?.id &&
                <Link to={'/serial-killers/$id'} params={{id: String(serialKiller.id)}} className={'stretched-link'}></Link>}
        </Card>
    )
}

export default ProfileCard;