<script lang="ts">
    import { admin } from '../Scripts/Init';
</script>

<button class="btn btn-light">
    <img id="pro-pic" src="{$admin.get_photo()}" alt="pro-pic"/>
    HI {$admin.get_first_name()}!
</button>

<style>
    .btn {
        position:fixed;
        top:10px;
        right:20px;
    }

    #pro-pic {
        width:20px;
        height:20px;
    }
</style>